import { createServer } from "node:http";
import { readFile, mkdir, appendFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findRecipeNode(node) {
  if (!node || typeof node !== "object") return null;

  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some((item) => String(item).toLowerCase() === "recipe")) return node;

  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findRecipeNode(child);
      if (found) return found;
    }
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      const found = findRecipeNode(value);
      if (found) return found;
    }
  }

  return null;
}

function normalizeIngredients(value) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(cleanText).filter(Boolean);
}

function normalizeInstructions(value) {
  if (!value) return "";
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => {
      if (typeof item === "string") return item;
      if (Array.isArray(item?.itemListElement)) return item.itemListElement;
      return item?.text || item?.name || "";
    })
    .map((item) => {
      if (typeof item === "string") return cleanText(item);
      return cleanText(item?.text || item?.name || "");
    })
    .filter(Boolean)
    .join(" ");
}

function classifyRecipe(recipe) {
  const text = `${recipe.name || ""} ${recipe.recipeCategory || ""} ${recipe.keywords || ""}`.toLowerCase();
  return /(cocktail|drink|beverage|mocktail|margarita|spritz|wine|beer|juice|smoothie)/.test(text)
    ? "drink"
    : "food";
}

function extractMeta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return cleanText(html.match(pattern)?.[1] || "");
}

function extractTitle(html) {
  return cleanText(extractMeta(html, "og:title") || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function parseRecipeHtml(html, sourceUrl) {
  const scriptMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  for (const match of scriptMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const recipe = findRecipeNode(parsed);
      if (!recipe) continue;

      const ingredients = normalizeIngredients(recipe.recipeIngredient);
      return {
        name: cleanText(recipe.name || extractTitle(html) || "Imported Recipe"),
        type: classifyRecipe(recipe),
        ingredients,
        displayIngredients: ingredients,
        steps: normalizeInstructions(recipe.recipeInstructions),
        sourceUrl
      };
    } catch {
      // Try the next JSON-LD script.
    }
  }

  return {
    name: extractTitle(html) || "Imported Recipe",
    type: "food",
    ingredients: [],
    displayIngredients: [],
    steps: "",
    sourceUrl
  };
}

async function importRecipe(request, response) {
  const { url } = await readJson(request);
  const sourceUrl = new URL(url);
  if (!["http:", "https:"].includes(sourceUrl.protocol)) {
    sendJson(response, 400, { error: "Use a public http or https recipe URL." });
    return;
  }

  const recipeResponse = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "PantryPourRecipeImporter/1.0"
    }
  });

  if (!recipeResponse.ok) {
    sendJson(response, 502, { error: `Could not fetch the recipe page (${recipeResponse.status}).` });
    return;
  }

  const html = await recipeResponse.text();
  const recipe = parseRecipeHtml(html, sourceUrl.toString());
  if (!recipe.ingredients.length) {
    sendJson(response, 422, {
      error: "I found the page, but not a structured ingredient list. You can still paste the ingredients manually.",
      recipe
    });
    return;
  }

  sendJson(response, 200, { recipe });
}

async function ingestRecipe(request, response) {
  const { recipe, content } = await readJson(request);
  if (!recipe?.name || !content) {
    sendJson(response, 400, { error: "Recipe and TGB content are required." });
    return;
  }

  const captureUrl = process.env.TGB_CAPTURE_URL;
  if (captureUrl) {
    const captureResponse = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.TGB_ACCESS_KEY ? { Authorization: `Bearer ${process.env.TGB_ACCESS_KEY}` } : {})
      },
      body: JSON.stringify({ content, recipe })
    });

    if (!captureResponse.ok) {
      sendJson(response, 502, { error: `TGB endpoint rejected the capture (${captureResponse.status}).` });
      return;
    }

    sendJson(response, 200, { ok: true, mode: "remote", message: "Saved recipe and sent it to TGB." });
    return;
  }

  await mkdir(join(root, "data"), { recursive: true });
  await appendFile(
    join(root, "data", "tgb-recipe-ingest.jsonl"),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), recipe, content })}\n`
  );

  sendJson(response, 200, {
    ok: true,
    mode: "local-queue",
    message: "Saved recipe and queued the TGB capture locally."
  });
}

async function listRecipes(response) {
  try {
    const file = await readFile(join(root, "data", "tgb-recipes.json"), "utf-8");
    const recipes = JSON.parse(file);
    sendJson(response, 200, {
      source: "tgb-snapshot",
      count: Array.isArray(recipes) ? recipes.length : 0,
      recipes: Array.isArray(recipes) ? recipes : []
    });
  } catch (error) {
    sendJson(response, 500, { error: "Could not load the TGB recipe index.", recipes: [] });
  }
}

async function serveStatic(pathname, response) {
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream"
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "POST" && url.pathname === "/api/import-recipe") {
      await importRecipe(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/tgb/ingest-recipe") {
      await ingestRecipe(request, response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/recipes") {
      await listRecipes(response);
      return;
    }

    if (request.method === "GET") {
      await serveStatic(url.pathname, response);
      return;
    }

    response.writeHead(405);
    response.end("Method not allowed");
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Unexpected server error." });
  }
});

server.listen(port, host, () => {
  console.log(`Pantry Pour running on ${host}:${port}`);
});
