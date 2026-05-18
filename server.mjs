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
  return decodeEntities(String(value))
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

const cutSentinelPattern = new RegExp(
  [
    "related (videos?|recipes?)",
    "you (may|might) also (like|enjoy)",
    "more (recipes?|like this|from)",
    "reader (reviews?|comments?)",
    "leave a (reply|comment)",
    "add (a|your) comment",
    "jump to comments?",
    "\\d+ comments?",
    "comments?",
    "view (all|more) comments?",
    "load more comments?",
    "show more comments?",
    "advertisement",
    "continue reading below",
    "promoted links",
    "sponsored (ads|content)",
    "you may like",
    "we recommend",
    "recent (posts|articles|comments)",
    "sign in to comment",
    "subscribe to",
    "privacy policy",
    "terms (of use|& conditions)",
    "trending recipes?",
    "previous (recipe|post)",
    "next (recipe|post)",
    "cocktail recipes",
    "all rights reserved"
  ]
    .map((item) => `^(?:${item})$`)
    .join("|"),
  "i"
);

const navDropPattern = /^(jump to recipe|jump to comments?|print recipe|pin recipe|email recipe|save recipe|skip to content)$/i;
const commentLinePattern =
  /\breply\s*$|\bon\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:,?\s+\d{4})?\s+reply\b|\bat\s+\d{1,2}:\d{2}\s*(?:am|pm)?\s+reply\b/i;
const replyStandalonePattern =
  /^(reply|\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}|(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s*\d{0,4}|at\s+\d{1,2}:\d{2}\s*(am|pm)?|\d+\s+stars?|rate it)$/i;
const recipeAnchorPattern =
  /^(ingredients?|directions?|instructions?|method|preparation|steps?|yields?|makes\b|serves?\b|servings?|time\b|prep time|cook time|total time|description\b|nutrition\b|recipe\b|notes?|tips?)$/i;
const sectionStopPattern =
  /^(directions?|instructions?|method|preparation|steps?|notes?|nutrition|recipe notes?|tips?|comments?|reviews?|related recipes?)$/i;
const ingredientStartPattern = /^(ingredients?|what you need|for the .+|shopping list)$/i;
const instructionStartPattern = /^(directions?|instructions?|method|preparation|steps?|make it|how to make.*)$/i;
const quantityLinePattern =
  /^([*\-•]|\d+\.|\(?\d|[¼½¾⅓⅔⅛⅜⅝⅞]|a |an |one |two |three |four |five |six |seven |eight |nine |ten )/i;

function stripHtmlToLines(html = "") {
  let text = String(html)
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<en-media[^>]*\/?>/gi, "")
    .replace(/<\/?en-note[^>]*>/gi, "");

  for (let index = 0; index < 3; index += 1) {
    const next = decodeEntities(text)
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<\/?(div|p|br|li|tr|h[1-6]|hr|ul|ol|table|thead|tbody|tfoot|section|article)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    if (next === text) break;
    text = next;
  }

  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);
}

function isTrashLine(line) {
  const value = line.trim().toLowerCase();
  if (!value) return true;
  if (/^https?:\/\/\S+$/.test(value)) return true;
  if (/^[\W_]+$/.test(value) && value.length < 50) return true;
  return /^(menu|search|share|tweet|pin it|print|advertisement|subscribe|sign in|log in|home|recipes)$/.test(value);
}

function cleanTitleForMatch(title = "") {
  return cleanText(title).split(/\s[|:–—-]\s/)[0].toLowerCase();
}

function findContentStart(lines, title) {
  const titleWords = cleanTitleForMatch(title).split(/\s+/).filter(Boolean);
  const title3 = titleWords.slice(0, 3).join(" ");
  const title2 = titleWords.slice(0, 2).join(" ");
  const limit = Math.min(lines.length, 140);

  for (let index = 0; index < limit; index += 1) {
    const line = lines[index].toLowerCase();
    if (title3.length > 8 && line.includes(title3)) return index;
    if (title2.length > 5 && index > 0 && line.includes(title2)) return index;
  }

  for (let index = 0; index < limit; index += 1) {
    if (recipeAnchorPattern.test(lines[index])) return index;
  }

  const longIndex = lines.slice(0, limit).findIndex((line) => line.length >= 80);
  return longIndex >= 8 ? longIndex : 0;
}

function cleanClippedRecipeBody(html, title = "") {
  const deduped = [];
  stripHtmlToLines(html)
    .filter((line) => !isTrashLine(line) && !navDropPattern.test(line))
    .forEach((line) => {
      if (!deduped.length || deduped[deduped.length - 1].toLowerCase() !== line.toLowerCase()) deduped.push(line);
    });

  let lines = deduped.slice(findContentStart(deduped, title));
  let charsSeen = 0;
  let cutAt = -1;

  for (let index = 0; index < lines.length; index += 1) {
    charsSeen += lines[index].length;
    if (charsSeen >= 600 && lines[index].length < 60 && cutSentinelPattern.test(lines[index].toLowerCase())) {
      cutAt = index;
      break;
    }
  }
  if (cutAt >= 0) lines = lines.slice(0, cutAt);

  charsSeen = 0;
  cutAt = -1;
  for (let index = 0; index < lines.length; index += 1) {
    charsSeen += lines[index].length;
    if (charsSeen >= 600 && commentLinePattern.test(lines[index])) {
      cutAt = index;
      break;
    }
  }
  if (cutAt >= 0) lines = lines.slice(0, cutAt);

  const cumulative = [0];
  lines.forEach((line) => cumulative.push(cumulative[cumulative.length - 1] + line.length));
  for (let index = 0; index < lines.length - 12; index += 1) {
    if (cumulative[index] < 600) continue;
    const replies = lines.slice(index, index + 12).filter((line) => replyStandalonePattern.test(line)).length;
    if (replies >= 3) {
      lines = lines.slice(0, index);
      break;
    }
  }

  while (lines.length > 5) {
    const last = lines[lines.length - 1].trim();
    if (last.length >= 60 || /[.!?]["')\]]?$/.test(last)) break;
    lines.pop();
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
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

function normalizeIngredientLine(line) {
  return cleanText(line)
    .replace(/^([*\-•]|\d+\.)\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractIngredientsFromCleanBody(body) {
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  const start = lines.findIndex((line) => ingredientStartPattern.test(line));
  if (start < 0) return [];

  const ingredients = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (instructionStartPattern.test(line) || sectionStopPattern.test(line)) break;
    if (line.length > 180) {
      if (ingredients.length) break;
      continue;
    }
    if (quantityLinePattern.test(line) || ingredients.length) {
      const ingredient = normalizeIngredientLine(line);
      if (ingredient && !sectionStopPattern.test(ingredient)) ingredients.push(ingredient);
    }
  }

  return ingredients.slice(0, 80);
}

function extractInstructionsFromCleanBody(body) {
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  const start = lines.findIndex((line) => instructionStartPattern.test(line));
  if (start < 0) return "";

  const steps = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (index > start + 1 && /^(notes?|nutrition|comments?|reviews?|related recipes?)$/i.test(line)) break;
    if (line.length < 3) continue;
    steps.push(cleanText(line.replace(/^([*\-•]|\d+\.)\s*/, "")));
  }

  return steps.join(" ");
}

function clippedRecipeFromHtml(html, sourceUrl) {
  const structured = parseRecipeHtml(html, sourceUrl);
  const title = structured.name || extractTitle(html) || "Clipped Recipe";
  const cleanBody = cleanClippedRecipeBody(html, title);
  const bodyIngredients = extractIngredientsFromCleanBody(cleanBody);
  const bodyInstructions = extractInstructionsFromCleanBody(cleanBody);
  const ingredients = bodyIngredients.length ? bodyIngredients : structured.displayIngredients || structured.ingredients || [];
  const steps = bodyInstructions || structured.steps || cleanBody.slice(0, 4000);

  return {
    ...structured,
    name: cleanText(title),
    type: classifyRecipe({ ...structured, name: title, keywords: cleanBody.slice(0, 800) }),
    ingredients,
    displayIngredients: ingredients,
    steps,
    sourceUrl,
    clippedBody: cleanBody
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

async function clipRecipe(request, response) {
  const { url } = await readJson(request);
  const sourceUrl = new URL(url);
  if (!["http:", "https:"].includes(sourceUrl.protocol)) {
    sendJson(response, 400, { error: "Use a public http or https recipe URL." });
    return;
  }

  const recipeResponse = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "PantryPourRecipeClipper/1.0"
    }
  });

  if (!recipeResponse.ok) {
    sendJson(response, 502, { error: `Could not fetch the recipe page (${recipeResponse.status}).` });
    return;
  }

  const html = await recipeResponse.text();
  const recipe = clippedRecipeFromHtml(html, sourceUrl.toString());
  if (!recipe.displayIngredients.length) {
    sendJson(response, 422, {
      error: "I clipped and cleaned the page, but could not find an ingredient list.",
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

async function captureRecipeEvent(request, response) {
  const { action, recipe, previousRecipe, content } = await readJson(request);
  if (!action || !recipe?.name || !content) {
    sendJson(response, 400, { error: "Recipe change action, recipe, and TGB content are required." });
    return;
  }

  const event = {
    capturedAt: new Date().toISOString(),
    action,
    recipe,
    previousRecipe: previousRecipe || null,
    content
  };

  const captureUrl = process.env.TGB_CAPTURE_URL;
  if (captureUrl) {
    const captureResponse = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.TGB_ACCESS_KEY ? { Authorization: `Bearer ${process.env.TGB_ACCESS_KEY}` } : {})
      },
      body: JSON.stringify(event)
    });

    if (!captureResponse.ok) {
      sendJson(response, 502, { error: `TGB endpoint rejected the recipe change (${captureResponse.status}).` });
      return;
    }

    sendJson(response, 200, { ok: true, mode: "remote", message: "Sent recipe change to TGB." });
    return;
  }

  await mkdir(join(root, "data"), { recursive: true });
  await appendFile(join(root, "data", "tgb-recipe-events.jsonl"), `${JSON.stringify(event)}\n`);

  sendJson(response, 200, {
    ok: true,
    mode: "local-queue",
    message: "Queued recipe change for TGB."
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

    if (request.method === "POST" && url.pathname === "/api/clip-recipe") {
      await clipRecipe(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/tgb/ingest-recipe") {
      await ingestRecipe(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/tgb/recipe-event") {
      await captureRecipeEvent(request, response);
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
