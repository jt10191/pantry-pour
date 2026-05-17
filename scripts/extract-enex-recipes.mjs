import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const inputs = [
  { path: "/Volumes/JTMMX/Users/JT/Downloads/Drinks.enex", type: "drink" },
  { path: "/Volumes/JTMMX/Users/JT/Downloads/Food.enex", type: "food" }
];

const outDir = new URL("../data/", import.meta.url);

const sectionStops = [
  "instructions",
  "instruction",
  "directions",
  "direction",
  "preparation",
  "preparations",
  "method",
  "methods",
  "steps",
  "step",
  "recipe notes",
  "notes",
  "nutrition",
  "nutritional information",
  "comments",
  "reviews",
  "related",
  "recommended",
  "you may also like",
  "advertisement"
];

const ingredientStarts = [
  "ingredients",
  "ingredient",
  "what you will need",
  "you will need",
  "you'll need",
  "for the",
  "for serving"
];

const instructionStarts = [
  "instructions",
  "directions",
  "preparation",
  "method",
  "steps",
  "to make",
  "make it"
];

const rejectTitlePatterns = [
  /comment/i,
  /discussion/i,
  /privacy policy/i,
  /terms of use/i,
  /sign in/i,
  /log in/i,
  /subscribe/i,
  /newsletter/i,
  /shopping list/i
];

const ingredientRejectPatterns = [
  /^about$/i,
  /^add to/i,
  /^select one:?$/i,
  /^us customary/i,
  /^metric$/i,
  /^units$/i,
  /^us$/i,
  /^print$/i,
  /^print recipe$/i,
  /^pin$/i,
  /^save$/i,
  /^save recipe$/i,
  /^share$/i,
  /^report this ad$/i,
  /^privacy policy$/i,
  /^featured on$/i,
  /^jump to recipe$/i,
  /^review$/i,
  /^reviews$/i,
  /^write a review$/i,
  /^your name$/i,
  /^your location$/i,
  /^your review$/i,
  /^shop$/i,
  /^video$/i,
  /^videos$/i,
  /^community$/i,
  /^facebook$/i,
  /^pinterest$/i,
  /^twitter$/i,
  /^instagram$/i,
  /^log in/i,
  /^login$/i,
  /^sign up$/i,
  /^subscription$/i,
  /^subscribe/i,
  /^newsletter$/i,
  /^nsclc information$/i,
  /^on sale near you$/i,
  /^find stores$/i,
  /^from our sponsor$/i,
  /^freshness guarantee$/i,
  /^advertisement$/i,
  /^these ads$/i,
  /^click to share/i,
  /^photo/i,
  /^image/i,
  /^optional$/i,
  /^garnish$/i,
  /^for garnish$/i,
  /^serves?\b/i,
  /^makes?\b/i,
  /^yield\b/i,
  /^total time\b/i,
  /^prep time\b/i,
  /^cook time\b/i,
  /^active time\b/i,
  /^calories\b/i
];

const units = [
  "cup",
  "cups",
  "c",
  "tablespoon",
  "tablespoons",
  "tbsp",
  "tbs",
  "teaspoon",
  "teaspoons",
  "tsp",
  "ounce",
  "ounces",
  "oz",
  "pound",
  "pounds",
  "lb",
  "lbs",
  "gram",
  "grams",
  "g",
  "kilogram",
  "kilograms",
  "kg",
  "milliliter",
  "milliliters",
  "ml",
  "liter",
  "liters",
  "l",
  "quart",
  "quarts",
  "qt",
  "pint",
  "pints",
  "pt",
  "can",
  "cans",
  "package",
  "packages",
  "pkg",
  "jar",
  "jars",
  "bottle",
  "bottles",
  "dash",
  "dashes",
  "pinch",
  "pinches",
  "slice",
  "slices",
  "clove",
  "cloves",
  "sprig",
  "sprigs",
  "bunch",
  "bunches",
  "stalk",
  "stalks",
  "piece",
  "pieces",
  "inch",
  "inches",
  "cm",
  "small",
  "medium",
  "large"
];

const unitsByLength = [...units].sort((a, b) => b.length - a.length);
const leadingMeasurePattern = new RegExp(
  `^(?:[\\d.,/\\s¼½¾⅓⅔⅛⅜⅝⅞]+|-|to taste\\b|about\\b|approximately\\b|approx\\.?\\b|plus\\b|more\\b|additional\\b|a\\b|an\\b)\\s*(?:${unitsByLength.join("|")})?\\b\\s*(?:of\\s+)?`,
  "i"
);

function decodeEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)));
}

function textBetween(note, tag) {
  const match = note.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function stripHtml(value = "") {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceUrl(note) {
  const direct = textBetween(note, "source-url");
  if (direct && !direct.startsWith("en-cache://")) return direct;
  const decoded = decodeEntities(direct);
  const embedded = decoded.match(/https?:\/\/[^\s+<"]+/i)?.[0];
  return embedded || "";
}

function htmlToLines(content) {
  const withBreaks = decodeEntities(content)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|ul|ol|h[1-6]|tr|table|section|article)>/gi, "\n")
    .replace(/<(li|h[1-6])[^>]*>/gi, "\n")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t\r\f\v]+/g, " ");

  return withBreaks
    .split("\n")
    .map((line) =>
      line
        .replace(/[□▢☐✓✔]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

function normalizedHeading(line) {
  return line
    .toLowerCase()
    .replace(/[:#]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isIngredientStart(line) {
  const heading = normalizedHeading(line);
  return ingredientStarts.some((start) => heading === start || heading.startsWith(`${start}:`));
}

function isInstructionStart(line) {
  const heading = normalizedHeading(line);
  return instructionStarts.some((start) => heading === start || heading.startsWith(`${start}:`));
}

function isStop(line) {
  const heading = normalizedHeading(line);
  return sectionStops.some((stop) => heading === stop || heading.startsWith(`${stop}:`));
}

function isLikelyIngredientLine(line) {
  if (!line || line.length < 2 || line.length > 180) return false;
  if (ingredientRejectPatterns.some((pattern) => pattern.test(line))) return false;
  if (isIngredientStart(line) || isInstructionStart(line)) return false;
  if (/^(https?:\/\/|www\.)/i.test(line)) return false;
  if (/[.!?]$/.test(line) && line.split(/\s+/).length > 12) return false;
  return (
    /^[\d¼½¾⅓⅔⅛⅜⅝⅞]/.test(line) ||
    new RegExp(`\\b(${units.join("|")})\\b`, "i").test(line) ||
    /^[a-z][a-z\s,'’()-]+$/i.test(line)
  );
}

function collectSection(lines, startPredicate, contentPredicate, maxLines = 80) {
  const start = lines.findIndex(startPredicate);
  if (start === -1) return [];

  const section = [];
  for (let i = start + 1; i < lines.length && section.length < maxLines; i += 1) {
    const line = lines[i];
    if (section.length && isStop(line)) break;
    if (isInstructionStart(line) && section.length) break;
    if (isIngredientStart(line) && !section.length) continue;
    if (contentPredicate(line)) section.push(line);
  }

  return section;
}

function collectBestIngredientSection(lines) {
  const starts = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => isIngredientStart(line));

  let best = [];
  let bestScore = 0;

  for (const { index } of starts) {
    const section = [];
    let clutter = 0;

    for (let i = index + 1; i < lines.length && section.length < 80; i += 1) {
      const line = lines[i];
      if (section.length && isStop(line)) break;
      if (section.length && isInstructionStart(line)) break;
      if (isIngredientStart(line)) continue;
      if (ingredientRejectPatterns.some((pattern) => pattern.test(line))) {
        clutter += 1;
        continue;
      }
      if (isLikelyIngredientLine(line)) section.push(line);
    }

    const score = section.length - clutter * 0.5;
    if (score > bestScore) {
      best = section;
      bestScore = score;
    }
  }

  return best;
}

function findInstructionText(lines) {
  const start = lines.findIndex(isInstructionStart);
  if (start === -1) return "";

  const steps = [];
  for (let i = start + 1; i < lines.length && steps.join(" ").length < 700; i += 1) {
    const line = lines[i];
    if (steps.length && /^(notes|nutrition|comments|reviews|related|recommended)$/i.test(normalizedHeading(line))) break;
    if (line.length < 3 || /^(\d+\.?)?$/.test(line)) continue;
    if (/^(advertisement|print|pin|save|share)$/i.test(line)) continue;
    steps.push(line.replace(/^\d+\s*/, ""));
  }

  return steps.join(" ").replace(/\s+/g, " ").slice(0, 700).trim();
}

function canonicalIngredient(line) {
  let value = line
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\b(?:for the|for serving|for garnish)\b.*$/g, " ")
    .replace(/,.*$/g, "")
    .replace(/\b(to taste|divided|chopped|minced|sliced|diced|peeled|fresh|freshly|ground|grated|crushed|thinly|roughly|finely|optional|trimmed|packed|melted|softened|room temperature)\b/g, " ")
    .replace(leadingMeasurePattern, " ")
    .replace(leadingMeasurePattern, " ")
    .replace(/\b(?:and|or)\s+.+$/g, " ")
    .replace(/[^a-z0-9&' -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  value = value.replace(new RegExp(`^(?:${unitsByLength.join("|")})\\s+`, "i"), "").trim();
  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function shouldRejectTitle(title) {
  return !title || rejectTitlePatterns.some((pattern) => pattern.test(title));
}

function parseNote(note, defaultType) {
  const title = stripHtml(textBetween(note, "title"));
  if (shouldRejectTitle(title)) return null;

  const content = textBetween(note, "content");
  const lines = htmlToLines(content);
  const ingredientLines = collectBestIngredientSection(lines);
  if (ingredientLines.length < 2) return null;

  const ingredients = [
    ...new Set(
      ingredientLines
        .map(canonicalIngredient)
        .filter((item) => item.length >= 2 && item.length <= 60)
        .filter((item) => !ingredientRejectPatterns.some((pattern) => pattern.test(item)))
        .filter((item) => !/^(ingredients|recipe|nutrition|advertisement|report this ad|reviews?)$/i.test(item))
        .filter((item) => !/^-/.test(item))
    )
  ].slice(0, 40);

  if (ingredients.length < 2) return null;

  return {
    id: `${defaultType === "drink" ? "drink" : "food"}-${slugify(title)}`,
    name: title.replace(/\s+\|\s+.*$/, "").trim(),
    type: defaultType,
    sourceUrl: sourceUrl(note),
    ingredients,
    ingredientLines,
    steps: findInstructionText(lines),
    source: "evernote"
  };
}

async function parseEnex(input) {
  return new Promise((resolve, reject) => {
    const recipes = [];
    let totalNotes = 0;
    let buffer = "";

    const stream = createReadStream(input.path, { encoding: "utf8", highWaterMark: 1024 * 1024 });
    stream.on("data", (chunk) => {
      buffer += chunk;
      let endIndex = buffer.indexOf("</note>");
      while (endIndex !== -1) {
        const note = buffer.slice(0, endIndex + "</note>".length);
        buffer = buffer.slice(endIndex + "</note>".length);
        totalNotes += 1;

        const recipe = parseNote(note, input.type);
        if (recipe) recipes.push(recipe);

        endIndex = buffer.indexOf("</note>");
      }
    });

    stream.on("error", reject);
    stream.on("end", () => resolve({ file: basename(input.path), totalNotes, recipes }));
  });
}

await mkdir(outDir, { recursive: true });

const results = [];
for (const input of inputs) {
  console.log(`Parsing ${input.path}`);
  results.push(await parseEnex(input));
}

const allRecipes = results.flatMap((result) => result.recipes);
const uniqueById = new Map();
for (const recipe of allRecipes) {
  if (!uniqueById.has(recipe.id)) uniqueById.set(recipe.id, recipe);
}

const candidates = [...uniqueById.values()].sort((a, b) => a.name.localeCompare(b.name));
const appRecipes = candidates.map(({ ingredientLines, ...recipe }) => recipe);

await writeFile(join(fileURLToPath(outDir), "recipe-candidates.json"), `${JSON.stringify(candidates, null, 2)}\n`);
await writeFile(join(fileURLToPath(outDir), "tgb-recipes.json"), `${JSON.stringify(appRecipes, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      files: results.map((result) => ({
        file: result.file,
        notes: result.totalNotes,
        parsedRecipes: result.recipes.length
      })),
      totalRecipes: appRecipes.length,
      output: "data/tgb-recipes.json"
    },
    null,
    2
  )
);
