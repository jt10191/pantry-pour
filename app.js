const fallbackRecipes = [
  {
    id: "margarita",
    name: "Classic Margarita",
    type: "drink",
    ingredients: ["tequila", "lime", "orange liqueur", "salt"],
    steps: "Shake tequila, lime, and orange liqueur with ice. Strain into a salted glass."
  },
  {
    id: "mojito",
    name: "Mint Mojito",
    type: "drink",
    ingredients: ["rum", "lime", "mint", "sugar", "soda water"],
    steps: "Muddle lime, mint, and sugar. Add rum and ice, then top with soda water."
  },
  {
    id: "old-fashioned",
    name: "Old Fashioned",
    type: "drink",
    ingredients: ["whiskey", "bitters", "sugar", "orange"],
    steps: "Stir whiskey, bitters, and sugar with ice. Finish with orange peel."
  },
  {
    id: "spritz",
    name: "Citrus Spritz",
    type: "drink",
    ingredients: ["sparkling wine", "orange", "soda water", "ice"],
    steps: "Build over ice with sparkling wine and orange, then add soda water."
  },
  {
    id: "daiquiri",
    name: "Simple Daiquiri",
    type: "drink",
    ingredients: ["rum", "lime", "sugar"],
    steps: "Shake rum, lime, and sugar with ice. Strain into a chilled glass."
  },
  {
    id: "gin-tonic",
    name: "Gin and Tonic",
    type: "drink",
    ingredients: ["gin", "tonic water", "lime", "ice"],
    steps: "Pour gin and tonic over ice. Squeeze in lime and stir once."
  },
  {
    id: "omelet",
    name: "Herb Omelet",
    type: "food",
    ingredients: ["eggs", "butter", "cheese", "herbs", "salt"],
    steps: "Whisk eggs with salt. Cook in butter, add cheese and herbs, then fold."
  },
  {
    id: "fried-rice",
    name: "Quick Fried Rice",
    type: "food",
    ingredients: ["rice", "eggs", "soy sauce", "garlic", "peas", "oil"],
    steps: "Cook garlic in oil, scramble eggs, add rice and peas, then season with soy sauce."
  },
  {
    id: "quesadilla",
    name: "Cheese Quesadilla",
    type: "food",
    ingredients: ["tortilla", "cheese", "salsa", "oil"],
    steps: "Toast tortilla with cheese in a lightly oiled pan. Slice and serve with salsa."
  },
  {
    id: "pasta",
    name: "Garlic Butter Pasta",
    type: "food",
    ingredients: ["pasta", "butter", "garlic", "parmesan", "salt"],
    steps: "Boil pasta. Toss with garlic butter, pasta water, parmesan, and salt."
  },
  {
    id: "toast",
    name: "Avocado Toast",
    type: "food",
    ingredients: ["bread", "avocado", "lime", "salt", "chili flakes"],
    steps: "Toast bread. Mash avocado with lime and salt, spread, and finish with chili flakes."
  },
  {
    id: "tacos",
    name: "Weeknight Tacos",
    type: "food",
    ingredients: ["tortilla", "beans", "cheese", "lime", "salsa", "lettuce"],
    steps: "Warm tortillas and beans. Fill with cheese, salsa, lettuce, and lime."
  }
];

const quickIngredients = [
  "lime",
  "eggs",
  "cheese",
  "rice",
  "garlic",
  "butter",
  "salt",
  "sugar",
  "rum",
  "tequila",
  "mint",
  "soda water",
  "tortilla",
  "salsa",
  "bread",
  "orange"
];

const storeKeys = {
  ingredients: "pantry-pour-ingredients",
  recipes: "pantry-pour-recipes",
  mealPlan: "pantry-pour-meal-plan",
  shoppingChecks: "pantry-pour-shopping-checks",
  deletedRecipes: "pantry-pour-deleted-recipes",
  tgbEventQueue: "pantry-pour-tgb-event-queue",
  tgbQueue: "pantry-pour-tgb-queue"
};

const mealDays = [
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" }
];

const grocerySections = [
  {
    name: "Produce",
    patterns: [
      /apple|avocado|arugula|asparagus|basil|beet|berry|broccoli|cabbage|carrot|celery|cilantro|cucumber|garlic|ginger|greens|herb|kale|leek|lemon|lettuce|lime|mint|mushroom|onion|orange|parsley|pepper|potato|radish|spinach|tomato|zucchini/
    ]
  },
  {
    name: "Meat & Seafood",
    patterns: [/anchov|bacon|beef|chicken|clam|cod|fish|ham|lamb|mackerel|mussel|oyster|pork|salmon|sardine|sausage|seafood|shrimp|steak|turkey|tuna/]
  },
  { name: "Dairy & Eggs", patterns: [/butter|cheddar|cheese|cream|egg|feta|kefir|milk|mozzarella|parmesan|ricotta|yogurt/] },
  { name: "Bakery", patterns: [/bagel|bread|bun|pita|roll|tortilla/] },
  { name: "Pantry", patterns: [/bean|broth|caper|cereal|chia|chickpea|flax|flour|honey|lentil|miso|mustard|nut|oil|olive|pasta|peanut|quinoa|rice|salt|sauce|seed|soy|spice|sugar|syrup|tempeh|tofu|vinegar/] },
  { name: "Frozen", patterns: [/frozen|ice cream|peas/] },
  { name: "Beverages", patterns: [/beer|bitters|gin|green tea|juice|liqueur|matcha|rum|soda|tea|tequila|vermouth|vodka|whiskey|wine/] }
];

const guidedFoodGroups = [
  { weight: 2, patterns: [/soy|tofu|edamame|tempeh|miso|natto/] },
  { weight: 2, patterns: [/green tea|matcha|oolong|black tea/] },
  { weight: 2, patterns: [/tomato|lycopene/] },
  { weight: 2, patterns: [/broccoli|brussels sprout|cauliflower|cabbage|kale|bok choy|watercress|cruciferous/] },
  { weight: 2, patterns: [/shiitake|maitake|reishi|oyster mushroom|white button|mushroom/] },
  { weight: 2, patterns: [/salmon|mackerel|sardine|anchov|oyster|mussel|clam|shrimp|cod|tuna|fish|seafood/] },
  { weight: 2, patterns: [/blueberr|strawberr|blackberr|cranberr|berry|berries|pomegranate|apple|kiwi|citrus|orange|lemon|lime/] },
  { weight: 2, patterns: [/garlic|ginger|turmeric|thyme|rosemary|sage|oregano/] },
  { weight: 1.5, patterns: [/lentil|chickpea|bean|almond|walnut|pumpkin seed|chia|flax/] },
  { weight: 1.5, patterns: [/yogurt|kefir|sauerkraut|kimchi|fermented/] },
  { weight: 1.5, patterns: [/spinach|arugula|swiss chard|leafy green|greens/] },
  { weight: 1, patterns: [/extra virgin olive oil|olive oil|dark chocolate|cacao/] }
];

const guidedStyleGroups = [
  { weight: 1, patterns: [/mediterranean|chinese|west coast|grain bowl|salad|soup|stir[- ]?fry|stir fried/] },
  { weight: 1, patterns: [/braised|grilled|poached|roasted|sauteed|saut.ed|steamed|baked/] },
  { weight: 1, patterns: [/vegetable|vegetarian|veggie|whole grain|quinoa|barley|farro|brown rice/] }
];

const guidedDessertPattern = /cake|cookie|pie|brownie|pudding|frosting|icing|sundae|ice cream|sorbet|candy|caramel|dessert/;

let ingredients = loadList(storeKeys.ingredients);
let customRecipes = loadRecipes();
let mealPlans = loadMealPlans();
let shoppingChecks = loadShoppingChecks();
let deletedRecipeIds = loadList(storeKeys.deletedRecipes);
let tgbEventQueue = loadList(storeKeys.tgbEventQueue);
let tgbRecipes = [...fallbackRecipes];
let recipeSourceLabel = "sample";
let activeFilter = "all";
let searchTerm = "";
let editingRecipeId = null;
let expandedRecipeIds = new Set();
let activeSidebarMode = "search";
let activeMealWeek = currentWeekKey();
let activeMealDay = mealDays[new Date().getDay()].key;
let activeMealRightView = "day";
let shoppingSort = "alpha";
const renderLimit = 160;
const instructionPreviewLength = 700;

const ingredientForm = document.querySelector("#ingredientForm");
const ingredientInput = document.querySelector("#ingredientInput");
const ingredientChips = document.querySelector("#ingredientChips");
const quickIngredientsNode = document.querySelector("#quickIngredients");
const clearIngredientsButton = document.querySelector("#clearIngredients");
const searchPanel = document.querySelector("#searchPanel");
const mealPlanPanel = document.querySelector("#mealPlanPanel");
const tgbPanel = document.querySelector("#tgbPanel");
const mealPlanAddForm = document.querySelector("#mealPlanAddForm");
const mealRecipeInput = document.querySelector("#mealRecipeInput");
const recipeTitleOptions = document.querySelector("#recipeTitleOptions");
const mealWeekInput = document.querySelector("#mealWeekInput");
const mealDayViewButton = document.querySelector("#mealDayViewButton");
const mealShoppingViewButton = document.querySelector("#mealShoppingViewButton");
const mealSummaryViewButton = document.querySelector("#mealSummaryViewButton");
const weekPlanRows = document.querySelector("#weekPlanRows");
const mealPlanIngredients = document.querySelector("#mealPlanIngredients");
const mealPlanStatus = document.querySelector("#mealPlanStatus");
const copyTgbEventsButton = document.querySelector("#copyTgbEvents");
const clearTgbEventsButton = document.querySelector("#clearTgbEvents");
const tgbSyncStatus = document.querySelector("#tgbSyncStatus");
const tgbQueueList = document.querySelector("#tgbQueueList");
const recipeForm = document.querySelector("#recipeForm");
const toggleRecipeFormButton = document.querySelector("#toggleRecipeForm");
const recipeName = document.querySelector("#recipeName");
const recipeType = document.querySelector("#recipeType");
const recipeIngredients = document.querySelector("#recipeIngredients");
const recipeSteps = document.querySelector("#recipeSteps");
const recipeSourceUrl = document.querySelector("#recipeSourceUrl");
const importRecipeUrlButton = document.querySelector("#importRecipeUrl");
const recipeFormStatus = document.querySelector("#recipeFormStatus");
const saveRecipeButton = document.querySelector("#saveRecipeButton");
const cancelRecipeEditButton = document.querySelector("#cancelRecipeEdit");
const recipeSearch = document.querySelector("#recipeSearch");
const recipeGrid = document.querySelector("#recipeGrid");
const recipeCardTemplate = document.querySelector("#recipeCardTemplate");
const readyCount = document.querySelector("#readyCount");
const closeCount = document.querySelector("#closeCount");
const ingredientCount = document.querySelector("#ingredientCount");
const recipeCount = document.querySelector("#recipeCount");
const readyLabel = document.querySelector("#readyLabel");
const closeLabel = document.querySelector("#closeLabel");
const ingredientLabel = document.querySelector("#ingredientLabel");
const recipeLabel = document.querySelector("#recipeLabel");
const resultsTitle = document.querySelector("#resultsTitle");
const resultNote = document.querySelector("#resultNote");
const matchHeadline = document.querySelector("#matchHeadline");

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function titleCase(value) {
  return value.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

const measureWords = [
  "cup",
  "cups",
  "tablespoon",
  "tablespoons",
  "tbsp",
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
  "small",
  "medium",
  "large"
];

const leadingMeasurePattern = new RegExp(
  `^(?:[\\d.,/\\s¼½¾⅓⅔⅛⅜⅝⅞]+|-|to taste\\b|about\\b|approximately\\b|approx\\.?\\b|plus\\b|more\\b|additional\\b|a\\b|an\\b)\\s*(?:${measureWords.join("|")})?\\b\\s*(?:of\\s+)?`,
  "i"
);

function loadList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function loadRecipes() {
  try {
    const value = JSON.parse(localStorage.getItem(storeKeys.recipes) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function currentWeekKey(date = new Date()) {
  const value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((value - yearStart) / 86400000 + 1) / 7);
  return `${value.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function weekStartDate(weekKey) {
  const [yearText, weekText] = weekKey.split("-W");
  const year = Number(yearText);
  const week = Number(weekText);
  const janFourth = new Date(Date.UTC(year, 0, 4));
  const day = janFourth.getUTCDay() || 7;
  const monday = new Date(janFourth);
  monday.setUTCDate(janFourth.getUTCDate() - day + 1 + (week - 1) * 7);
  return monday;
}

function weekKeyFromStartDate(date) {
  return currentWeekKey(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function previousWeekKeys(count = 13) {
  const start = weekStartDate(currentWeekKey());
  return Array.from({ length: count }, (_, index) => {
    const week = new Date(start);
    week.setUTCDate(start.getUTCDate() - index * 7);
    return weekKeyFromStartDate(week);
  });
}

function formatWeekLabel(weekKey) {
  const start = weekStartDate(weekKey);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const startText = start.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  const endText = end.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  return `${weekKey.replace("-W", " week ")} (${startText}-${endText})`;
}

function emptyMealPlan() {
  return Object.fromEntries(mealDays.map((day) => [day.key, []]));
}

function isSingleWeekPlan(value) {
  return value && typeof value === "object" && mealDays.some((day) => Array.isArray(value[day.key]));
}

function normalizeWeekPlan(value) {
  const plan = emptyMealPlan();
  mealDays.forEach((day) => {
    plan[day.key] = Array.isArray(value?.[day.key]) ? value[day.key].filter(Boolean) : [];
  });
  return plan;
}

function loadMealPlans() {
  try {
    const value = JSON.parse(localStorage.getItem(storeKeys.mealPlan) || "{}");
    if (isSingleWeekPlan(value)) return { [currentWeekKey()]: normalizeWeekPlan(value) };

    return Object.fromEntries(
      Object.entries(value || {})
        .filter(([weekKey]) => /^\d{4}-W\d{2}$/.test(weekKey))
        .map(([weekKey, plan]) => [weekKey, normalizeWeekPlan(plan)])
    );
  } catch {
    return {};
  }
}

function loadShoppingChecks() {
  try {
    const value = JSON.parse(localStorage.getItem(storeKeys.shoppingChecks) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(storeKeys.ingredients, JSON.stringify(ingredients));
  localStorage.setItem(storeKeys.recipes, JSON.stringify(customRecipes));
  localStorage.setItem(storeKeys.mealPlan, JSON.stringify(mealPlans));
  localStorage.setItem(storeKeys.shoppingChecks, JSON.stringify(shoppingChecks));
  localStorage.setItem(storeKeys.deletedRecipes, JSON.stringify(deletedRecipeIds));
}

function saveTgbQueue(recipe, content, status) {
  const queue = loadList(storeKeys.tgbQueue);
  queue.push({
    id: `tgb-${Date.now()}`,
    capturedAt: new Date().toISOString(),
    status,
    recipe,
    content
  });
  localStorage.setItem(storeKeys.tgbQueue, JSON.stringify(queue));
}

function saveTgbEventQueue(event, status) {
  tgbEventQueue = [...tgbEventQueue];
  tgbEventQueue.push({
    id: `tgb-event-${Date.now()}-${tgbEventQueue.length}`,
    capturedAt: new Date().toISOString(),
    status,
    ...event
  });
  localStorage.setItem(storeKeys.tgbEventQueue, JSON.stringify(tgbEventQueue));
}

function splitIngredients(value) {
  return value
    .split(/,|\n/)
    .map(normalize)
    .filter(Boolean);
}

function splitIngredientEntries(value) {
  const source = value.includes("\n") ? value.split(/\n/) : value.split(",");
  return source.map((item) => item.trim()).filter(Boolean);
}

function canonicalIngredient(line) {
  return normalize(
    String(line)
      .replace(/\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\b(?:for the|for serving|for garnish)\b.*$/gi, " ")
      .replace(/,.*$/g, " ")
      .replace(/\b(to taste|divided|chopped|minced|sliced|diced|peeled|fresh|freshly|ground|grated|crushed|thinly|roughly|finely|optional|trimmed|packed|melted|softened|room temperature)\b/gi, " ")
      .replace(leadingMeasurePattern, " ")
      .replace(leadingMeasurePattern, " ")
      .replace(/[^a-z0-9&' -]/gi, " ")
      .replace(/\s+/g, " ")
  );
}

function recipeDisplayIngredients(recipe) {
  if (Array.isArray(recipe.displayIngredients) && recipe.displayIngredients.length) return recipe.displayIngredients;
  if (Array.isArray(recipe.ingredientLines) && recipe.ingredientLines.length) return recipe.ingredientLines;
  return Array.isArray(recipe.ingredients) ? recipe.ingredients.map(titleCase) : [];
}

function ingredientDisplayMap(recipe, canonicalIngredients) {
  const displayByCanonical = new Map();
  recipeDisplayIngredients(recipe).forEach((line) => {
    const key = canonicalIngredient(line);
    if (key && !displayByCanonical.has(key)) displayByCanonical.set(key, line);
  });

  canonicalIngredients.forEach((ingredient) => {
    if (!displayByCanonical.has(ingredient)) displayByCanonical.set(ingredient, titleCase(ingredient));
  });

  return displayByCanonical;
}

const fractionCharacters = {
  "¼": 0.25,
  "½": 0.5,
  "¾": 0.75,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "⅛": 0.125,
  "⅜": 0.375,
  "⅝": 0.625,
  "⅞": 0.875
};

const unitAliases = {
  c: "cup",
  cup: "cup",
  cups: "cup",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tbsp: "tbsp",
  tbs: "tbsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  tsp: "tsp",
  ounce: "oz",
  ounces: "oz",
  oz: "oz",
  pound: "lb",
  pounds: "lb",
  lb: "lb",
  lbs: "lb",
  gram: "g",
  grams: "g",
  g: "g",
  kilogram: "kg",
  kilograms: "kg",
  kg: "kg",
  milliliter: "ml",
  milliliters: "ml",
  ml: "ml",
  liter: "l",
  liters: "l",
  l: "l",
  quart: "qt",
  quarts: "qt",
  qt: "qt",
  pint: "pt",
  pints: "pt",
  pt: "pt",
  can: "can",
  cans: "can",
  package: "package",
  packages: "package",
  pkg: "package",
  jar: "jar",
  jars: "jar",
  bottle: "bottle",
  bottles: "bottle",
  dash: "dash",
  dashes: "dash",
  pinch: "pinch",
  pinches: "pinch",
  slice: "slice",
  slices: "slice",
  clove: "clove",
  cloves: "clove",
  sprig: "sprig",
  sprigs: "sprig",
  bunch: "bunch",
  bunches: "bunch"
};

function parseQuantity(value) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed === "a" || trimmed === "an") return 1;
  if (fractionCharacters[trimmed]) return fractionCharacters[trimmed];

  const normalized = trimmed.replace(/\s*\/\s*/g, "/");
  const mixed = normalized.match(/^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);

  const fraction = normalized.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);

  const decimal = Number(normalized);
  return Number.isFinite(decimal) ? decimal : null;
}

function parsePlanIngredient(line, canonical) {
  const normalizedLine = line
    .replace(/([¼½¾⅓⅔⅛⅜⅝⅞])/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalizedLine.match(
    /^(?:about|approximately|approx\.?)?\s*((?:\d+(?:\.\d+)?\s+)?\d+\s*\/\s*\d+|\d+(?:\.\d+)?|a|an|[¼½¾⅓⅔⅛⅜⅝⅞])\s*([a-zA-Z]+)?\b/
  );

  if (!match) return { canonical, raw: line, quantity: null, unit: null };

  const quantity = parseQuantity(match[1]);
  const unit = unitAliases[normalize(match[2] || "")] || null;
  return { canonical, raw: line, quantity, unit };
}

function formatQuantity(value) {
  if (Math.abs(value - Math.round(value)) < 0.001) return String(Math.round(value));
  const whole = Math.floor(value);
  const fraction = value - whole;
  const common = [
    [0.25, "1/4"],
    [1 / 3, "1/3"],
    [0.5, "1/2"],
    [2 / 3, "2/3"],
    [0.75, "3/4"]
  ].find(([decimal]) => Math.abs(fraction - decimal) < 0.03);
  if (common) return whole ? `${whole} ${common[1]}` : common[1];
  return String(Math.round(value * 10) / 10);
}

function displayUnit(unit, quantity) {
  if (!unit) return "";
  if (["tbsp", "tsp", "oz", "g", "kg", "ml", "l", "qt", "pt"].includes(unit)) return unit;
  return Math.abs(quantity - 1) < 0.001 ? unit : `${unit}s`;
}

function addIngredients(values) {
  const next = new Set(ingredients);
  values.map(normalize).filter(Boolean).forEach((item) => next.add(item));
  ingredients = [...next].sort();
  saveState();
  render();
}

function removeIngredient(item) {
  ingredients = ingredients.filter((ingredient) => ingredient !== item);
  saveState();
  render();
}

async function deleteRecipe(recipe) {
  const confirmed = window.confirm(`Delete "${recipe.name}" from Pantry Pour?`);
  if (!confirmed) return;

  deletedRecipeIds = [...new Set([...deletedRecipeIds, recipe.id])];
  customRecipes = customRecipes.filter((item) => item.id !== recipe.id);
  Object.keys(mealPlans).forEach((weekKey) => {
    mealDays.forEach((day) => {
      mealPlans[weekKey][day.key] = mealPlans[weekKey][day.key].filter((plannedId) => plannedId !== recipe.id);
    });
  });
  if (editingRecipeId === recipe.id) resetRecipeForm();
  saveState();
  render();
  await syncRecipeEventToTgb("deleted", recipe);
}

function hasLocalRecipe(recipeId) {
  return customRecipes.some((recipe) => recipe.id === recipeId);
}

function setMealPlanStatus(message, tone = "neutral") {
  mealPlanStatus.textContent = message;
  mealPlanStatus.dataset.tone = tone;
}

function setTgbSyncStatus(message, tone = "neutral") {
  tgbSyncStatus.textContent = message;
  tgbSyncStatus.dataset.tone = tone;
}

function findRecipeByTitle(title) {
  const wanted = normalize(title);
  return allRecipes().find((recipe) => normalize(recipe.name) === wanted) || null;
}

function recipesById() {
  const byId = new Map();
  allRecipes().forEach((recipe) => byId.set(recipe.id, recipe));
  return byId;
}

function currentMealPlan() {
  if (!mealPlans[activeMealWeek]) mealPlans[activeMealWeek] = emptyMealPlan();
  return mealPlans[activeMealWeek];
}

function plannedRecipesForDay(dayKey, weekKey = activeMealWeek) {
  const byId = recipesById();
  const plan = mealPlans[weekKey] || emptyMealPlan();
  return (plan[dayKey] || []).map((recipeId) => byId.get(recipeId)).filter(Boolean);
}

function plannedRecipeIdsForWeek(weekKey = activeMealWeek) {
  const plan = mealPlans[weekKey] || emptyMealPlan();
  return mealDays.flatMap((day) => plan[day.key] || []);
}

function addRecipeToMealDay(dayKey, recipe) {
  const plan = currentMealPlan();
  const current = new Set(plan[dayKey] || []);
  if (current.has(recipe.id)) {
    setMealPlanStatus(`${recipe.name} is already on ${mealDays.find((day) => day.key === dayKey).label}.`, "warning");
    return;
  }

  mealPlans = {
    ...mealPlans,
    [activeMealWeek]: {
      ...plan,
      [dayKey]: [...current, recipe.id]
    }
  };
  saveState();
  activeMealRightView = "day";
  setMealPlanStatus(`Added to ${mealDays.find((day) => day.key === dayKey).label}.`, "success");
  render();
}

function removeRecipeFromMealDay(dayKey, recipeId) {
  const plan = currentMealPlan();
  mealPlans = {
    ...mealPlans,
    [activeMealWeek]: {
      ...plan,
      [dayKey]: (plan[dayKey] || []).filter((plannedId) => plannedId !== recipeId)
    }
  };
  saveState();
  render();
}

function setFormStatus(message, tone = "neutral") {
  recipeFormStatus.textContent = message;
  recipeFormStatus.dataset.tone = tone;
}

function openRecipeForm() {
  recipeForm.classList.remove("collapsed");
  toggleRecipeFormButton.setAttribute("aria-expanded", "true");
  toggleRecipeFormButton.setAttribute("aria-label", "Hide add recipe form");
  toggleRecipeFormButton.title = "Hide add recipe form";
}

function resetRecipeForm() {
  recipeForm.reset();
  editingRecipeId = null;
  saveRecipeButton.textContent = "Save Recipe";
  cancelRecipeEditButton.classList.remove("visible");
  setFormStatus("", "neutral");
}

function startRecipeEdit(recipe) {
  openRecipeForm();
  editingRecipeId = recipe.id;
  recipeName.value = recipe.name || "";
  recipeType.value = recipe.type || "food";
  recipeIngredients.value = recipeDisplayIngredients(recipe).join("\n");
  recipeSteps.value = recipe.steps || "";
  recipeSourceUrl.value = recipe.sourceUrl || "";
  saveRecipeButton.textContent = "Save Changes";
  cancelRecipeEditButton.classList.add("visible");
  setFormStatus("Editing recipe. Saving creates your corrected version in this app.", "neutral");
  recipeName.focus();
}

function formatTgbRecipeThought(recipe) {
  const ingredientsText = recipeDisplayIngredients(recipe).map((ingredient) => `- ${ingredient}`).join("\n");
  const sourceText = recipe.sourceUrl ? `\nSource URL: ${recipe.sourceUrl}` : "";
  const stepsText = recipe.steps ? `\nSteps: ${recipe.steps}` : "";

  return `Recipe captured for Pantry Pour / TGB.
Name: ${recipe.name}
Type: ${recipe.type}${sourceText}
Ingredients:
${ingredientsText}${stepsText}`;
}

function formatTgbRecipeEvent(action, recipe, previousRecipe = null) {
  const currentIngredients = recipeDisplayIngredients(recipe).map((ingredient) => `- ${ingredient}`).join("\n");
  const previousIngredients = previousRecipe
    ? recipeDisplayIngredients(previousRecipe).map((ingredient) => `- ${ingredient}`).join("\n")
    : "";
  const previousText = previousRecipe
    ? `

Previous version:
Name: ${previousRecipe.name}
Type: ${previousRecipe.type}
Ingredients:
${previousIngredients}
Instructions: ${previousRecipe.steps || "No instructions saved."}`
    : "";

  return `Recipe ${action} in Pantry Pour / TGB.
Recipe ID: ${recipe.id}
Name: ${recipe.name}
Type: ${recipe.type}
Source URL: ${recipe.sourceUrl || "None"}
Ingredients:
${currentIngredients}
Instructions: ${recipe.steps || "No instructions saved."}${previousText}`;
}

async function importRecipeFromUrl(url) {
  const response = await fetch("/api/import-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Could not import that recipe URL.");
  }

  return payload.recipe;
}

async function ingestRecipeIntoTgb(recipe) {
  const content = formatTgbRecipeThought(recipe);

  try {
    const response = await fetch("/api/tgb/ingest-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe, content })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "TGB bridge did not accept the recipe.");
    }

    if (payload.mode === "local-queue") {
      saveTgbQueue(recipe, content, "queued");
    }

    return payload;
  } catch (error) {
    saveTgbQueue(recipe, content, "queued-local");
    return {
      ok: true,
      mode: "browser-queue",
      message: "Saved locally and queued for TGB capture when the bridge is available."
    };
  }
}

async function syncRecipeEventToTgb(action, recipe, previousRecipe = null) {
  const content = formatTgbRecipeEvent(action, recipe, previousRecipe);
  const event = { action, recipe, previousRecipe, content };

  try {
    const response = await fetch("/api/tgb/recipe-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "TGB bridge did not accept the recipe change.");
    }

    if (payload.mode === "local-queue") {
      saveTgbEventQueue(event, "queued");
    }

    return payload;
  } catch {
    saveTgbEventQueue(event, "queued-local");
    return {
      ok: true,
      mode: "browser-queue",
      message: "Saved recipe change locally for TGB sync."
    };
  }
}

function allRecipes() {
  const deleted = new Set(deletedRecipeIds);
  const recipesById = new Map();
  tgbRecipes.forEach((recipe) => {
    if (!deleted.has(recipe.id)) recipesById.set(recipe.id, recipe);
  });
  customRecipes.forEach((recipe) => {
    if (!deleted.has(recipe.id)) recipesById.set(recipe.id, recipe);
  });
  return [...recipesById.values()];
}

async function loadTgbRecipes() {
  try {
    const response = await fetch("/api/recipes");
    const payload = await response.json();
    if (!response.ok || !Array.isArray(payload.recipes) || !payload.recipes.length) {
      throw new Error(payload.error || "TGB recipe index is empty.");
    }

    tgbRecipes = payload.recipes;
    recipeSourceLabel = payload.source || "tgb";
  } catch {
    tgbRecipes = [...fallbackRecipes];
    recipeSourceLabel = "sample fallback";
  }

  render();
}

function decorateRecipe(recipe) {
  const pantry = new Set(ingredients);
  const recipeIngredients = (recipe.ingredients || []).map(normalize).filter(Boolean);
  const displayByCanonical = ingredientDisplayMap(recipe, recipeIngredients);
  const have = recipeIngredients.filter((item) => pantry.has(item));
  const need = recipeIngredients.filter((item) => !pantry.has(item));
  const score = recipeIngredients.length ? have.length / recipeIngredients.length : 0;
  const ingredientDisplay = recipeIngredients.map((item) => ({
    label: displayByCanonical.get(item) || titleCase(item),
    status: pantry.has(item) ? "have" : "need"
  }));

  return {
    ...recipe,
    ingredients: recipeIngredients,
    have,
    need,
    ingredientDisplay,
    haveDisplay: have.map((item) => displayByCanonical.get(item) || titleCase(item)),
    needDisplay: need.map((item) => displayByCanonical.get(item) || titleCase(item)),
    score,
    isReady: need.length === 0,
    isClose: have.length > 0 && need.length > 0 && need.length <= 2
  };
}

function recipeMatchesFilters(recipe, includeType = true) {
  if (includeType && activeFilter === "guided" && !isGuidedRecipe(recipe)) return false;
  if (includeType && activeFilter !== "all" && activeFilter !== "guided" && recipe.type !== activeFilter) return false;
  if (!searchTerm) return true;
  const haystack = [recipe.name, recipe.type, ...recipe.ingredients].join(" ").toLowerCase();
  return haystack.includes(searchTerm);
}

function guidedRecipeHaystack(recipe) {
  return [recipe.name, recipe.type, recipe.steps, ...(recipe.ingredients || []), ...recipeDisplayIngredients(recipe)]
    .join(" ")
    .toLowerCase();
}

function guidedScore(recipe) {
  if (recipe.type !== "food") return 0;

  const haystack = guidedRecipeHaystack(recipe);
  const defenseFoodScore = guidedFoodGroups.reduce(
    (total, group) => total + (group.patterns.some((pattern) => pattern.test(haystack)) ? group.weight : 0),
    0
  );
  const styleScore = guidedStyleGroups.reduce(
    (total, group) => total + (group.patterns.some((pattern) => pattern.test(haystack)) ? group.weight : 0),
    0
  );
  const score = defenseFoodScore + styleScore;

  if (guidedDessertPattern.test(haystack) && defenseFoodScore < 5) return 0;
  return score;
}

function isGuidedRecipe(recipe) {
  return guidedScore(recipe) >= 3;
}

function getMatches() {
  return allRecipes()
    .map(decorateRecipe)
    .filter(recipeMatchesFilters)
    .sort((a, b) => {
      if (activeFilter === "guided") {
        const guidedDelta = guidedScore(b) - guidedScore(a);
        if (guidedDelta) return guidedDelta;
      }
      if (b.isReady !== a.isReady) return Number(b.isReady) - Number(a.isReady);
      if (b.score !== a.score) return b.score - a.score;
      return a.need.length - b.need.length || a.name.localeCompare(b.name);
    });
}

function getMealPlanMatches() {
  return plannedRecipesForDay(activeMealDay)
    .map(decorateRecipe)
    .filter((recipe) => recipeMatchesFilters(recipe, false));
}

function makeIngredientItems(list, node) {
  node.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.status === "have" ? "ingredient-have" : "ingredient-need";
    li.textContent = item.label;
    node.append(li);
  });
}

function instructionPreviewText(text, isExpanded) {
  if (isExpanded || text.length <= instructionPreviewLength) return text;
  return `${text.slice(0, instructionPreviewLength).trim()}...`;
}

function toggleInstructions(recipeId) {
  expandedRecipeIds = new Set(expandedRecipeIds);
  if (expandedRecipeIds.has(recipeId)) {
    expandedRecipeIds.delete(recipeId);
  } else {
    expandedRecipeIds.add(recipeId);
  }
  render();
}

function closePlanMenus(except = null) {
  document.querySelectorAll(".plan-menu.open").forEach((menu) => {
    if (menu !== except) menu.classList.remove("open");
  });
}

function tgbEventText(event) {
  return event.content || formatTgbRecipeEvent(event.action, event.recipe, event.previousRecipe);
}

function tgbEventBundle() {
  return tgbEventQueue.map((event, index) => `# TGB recipe correction ${index + 1}\n${tgbEventText(event)}`).join("\n\n---\n\n");
}

async function copyTgbEventQueue() {
  if (!tgbEventQueue.length) return;
  const text = tgbEventBundle();

  try {
    await navigator.clipboard.writeText(text);
    setTgbSyncStatus(`Copied ${tgbEventQueue.length} pending correction${tgbEventQueue.length === 1 ? "" : "s"}.`, "success");
  } catch {
    window.prompt("Copy these TGB correction notes:", text);
    setTgbSyncStatus("Copy the correction notes from the prompt.", "warning");
  }
}

function clearTgbEventQueue() {
  if (!tgbEventQueue.length) return;
  const confirmed = window.confirm("Mark all pending TGB correction notes as captured?");
  if (!confirmed) return;

  tgbEventQueue = [];
  localStorage.setItem(storeKeys.tgbEventQueue, JSON.stringify(tgbEventQueue));
  setTgbSyncStatus("Cleared pending TGB correction notes.", "success");
  render();
}

function mealPlanIngredientTotals(weekKey = activeMealWeek) {
  const totals = new Map();
  const byId = recipesById();

  plannedRecipeIdsForWeek(weekKey).forEach((recipeId) => {
    const recipe = byId.get(recipeId);
    if (!recipe) return;

    const canonicalIngredients = (recipe.ingredients || []).map(normalize).filter(Boolean);
    const displayByCanonical = ingredientDisplayMap(recipe, canonicalIngredients);

    canonicalIngredients.forEach((ingredient) => {
      const raw = displayByCanonical.get(ingredient) || titleCase(ingredient);
      const parsed = parsePlanIngredient(raw, ingredient);
      const current =
        totals.get(ingredient) || {
          key: ingredient,
          label: titleCase(ingredient),
          raw,
          quantity: 0,
          unit: parsed.unit,
          count: 0,
          raws: [],
          mixed: false
        };

      if (parsed.quantity && !current.mixed) {
        if (current.count === 0 || current.unit === parsed.unit) {
          current.quantity += parsed.quantity;
          current.unit = parsed.unit;
        } else {
          current.mixed = true;
        }
      } else {
        current.mixed = true;
      }

      current.count += 1;
      if (!current.raws.includes(raw)) current.raws.push(raw);
      totals.set(ingredient, current);
    });
  });

  return [...totals.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function formatMealIngredientTotal(item) {
  if (!item.mixed && item.quantity > 0) {
    const unit = displayUnit(item.unit, item.quantity);
    return [formatQuantity(item.quantity), unit, item.label].filter(Boolean).join(" ");
  }

  if (item.raws?.length > 1) return item.raws.join(" + ");
  return item.count > 1 ? `${item.count} x ${item.raw}` : item.raw;
}

function grocerySectionFor(item) {
  const haystack = `${item.label || ""} ${item.raw || ""} ${item.key || ""}`.toLowerCase();
  return grocerySections.find((section) => section.patterns.some((pattern) => pattern.test(haystack)))?.name || "Other";
}

function shoppingCheckKey(value) {
  return `${activeMealWeek}:${normalize(value).replace(/[^a-z0-9]+/g, "-")}`;
}

function isShoppingItemChecked(value) {
  return Boolean(shoppingChecks[shoppingCheckKey(value)]);
}

function setShoppingItemChecked(value, checked) {
  const key = shoppingCheckKey(value);
  shoppingChecks = { ...shoppingChecks };
  if (checked) {
    shoppingChecks[key] = true;
  } else {
    delete shoppingChecks[key];
  }
  saveState();
}

function createShoppingCheckItem(text, meta = "") {
  const label = document.createElement("label");
  label.className = "shopping-check-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isShoppingItemChecked(`${meta} ${text}`);
  checkbox.addEventListener("change", () => setShoppingItemChecked(`${meta} ${text}`, checkbox.checked));

  const content = document.createElement("span");
  content.textContent = text;

  label.append(checkbox, content);
  return label;
}

function plannedRecipeEntriesForWeek(weekKey = activeMealWeek) {
  return mealDays.flatMap((day) =>
    plannedRecipesForDay(day.key, weekKey).map((recipe) => ({
      day,
      recipe
    }))
  );
}

function renderShoppingList() {
  recipeGrid.innerHTML = "";
  const shell = document.createElement("section");
  shell.className = "shopping-list-view";

  const controls = document.createElement("div");
  controls.className = "shopping-sort";
  [
    ["alpha", "A-Z"],
    ["meal", "By meal"],
    ["section", "By section"]
  ].forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shopping-sort-button${shoppingSort === value ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      shoppingSort = value;
      render();
    });
    controls.append(button);
  });
  shell.append(controls);
  recipeGrid.append(shell);

  if (shoppingSort === "meal") {
    const entries = plannedRecipeEntriesForWeek();
    if (!entries.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<h3>No dinners planned</h3><p>Add recipes to the week to build a shopping list.</p>";
      shell.append(empty);
      return;
    }

    entries.forEach(({ day, recipe }) => {
      const group = document.createElement("article");
      group.className = "shopping-group";
      const heading = document.createElement("h3");
      heading.textContent = `${day.short}: ${recipe.name}`;
      group.append(heading);
      recipeDisplayIngredients(recipe).forEach((ingredient) => {
        group.append(createShoppingCheckItem(ingredient, `${day.key}-${recipe.id}`));
      });
      shell.append(group);
    });
  } else if (shoppingSort === "section") {
    const grouped = new Map();
    mealPlanIngredientTotals().forEach((item) => {
      const section = grocerySectionFor(item);
      if (!grouped.has(section)) grouped.set(section, []);
      grouped.get(section).push(item);
    });

    if (!grouped.size) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<h3>No ingredients yet</h3><p>Add recipes to the week to build a shopping list.</p>";
      shell.append(empty);
      return;
    }

    [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([section, items]) => {
      const group = document.createElement("article");
      group.className = "shopping-group";
      const heading = document.createElement("h3");
      heading.textContent = section;
      group.append(heading);
      items
        .sort((a, b) => a.label.localeCompare(b.label))
        .forEach((item) => group.append(createShoppingCheckItem(formatMealIngredientTotal(item), section)));
      shell.append(group);
    });
  } else {
    const totals = mealPlanIngredientTotals();
    if (!totals.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<h3>No ingredients yet</h3><p>Add recipes to the week to build a shopping list.</p>";
      shell.append(empty);
      return;
    }

    const group = document.createElement("article");
    group.className = "shopping-group";
    totals.forEach((item) => group.append(createShoppingCheckItem(formatMealIngredientTotal(item), "alpha")));
    shell.append(group);
  }

}

function renderRecipeTitleOptions() {
  recipeTitleOptions.innerHTML = "";
  allRecipes()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((recipe) => {
      const option = document.createElement("option");
      option.value = recipe.name;
      recipeTitleOptions.append(option);
    });
}

function renderWeekPlanRows() {
  weekPlanRows.innerHTML = "";
  const plan = currentMealPlan();
  const byId = recipesById();

  mealDays.forEach((day) => {
    const row = document.createElement("button");
    row.className = `week-plan-row${day.key === activeMealDay ? " active" : ""}`;
    row.type = "button";
    row.setAttribute("aria-label", `Show ${day.label} dinners`);
    row.addEventListener("click", () => {
      activeMealDay = day.key;
      activeMealRightView = "day";
      render();
    });

    const label = document.createElement("span");
    label.className = "week-plan-day";
    label.textContent = day.short;

    const titles = document.createElement("span");
    titles.className = "week-plan-titles";
    const recipes = (plan[day.key] || []).map((recipeId) => byId.get(recipeId)).filter(Boolean);
    titles.textContent = recipes.length ? recipes.map((recipe) => recipe.name).join(", ") : "No dinner planned";

    row.append(label, titles);
    weekPlanRows.append(row);
  });
}

function renderMealPlanIngredients() {
  mealPlanIngredients.innerHTML = "";
  const totals = mealPlanIngredientTotals();

  if (!totals.length) {
    const empty = document.createElement("li");
    empty.className = "muted-text";
    empty.textContent = "Add dinners to build the shopping list.";
    mealPlanIngredients.append(empty);
    return;
  }

  totals.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = formatMealIngredientTotal(item);
    mealPlanIngredients.append(li);
  });
}

function renderMealPlanPanel() {
  renderRecipeTitleOptions();
  mealWeekInput.value = activeMealWeek;
  mealDayViewButton.classList.toggle("active", activeMealRightView === "day");
  mealShoppingViewButton.classList.toggle("active", activeMealRightView === "shopping");
  mealSummaryViewButton.classList.toggle("active", activeMealRightView === "summary");
  renderWeekPlanRows();
  renderMealPlanIngredients();
}

function renderMealSummaryCards() {
  recipeGrid.innerHTML = "";
  previousWeekKeys().forEach((weekKey) => {
    const card = document.createElement("article");
    card.className = "meal-summary-card";

    const heading = document.createElement("h3");
    heading.textContent = formatWeekLabel(weekKey);
    card.append(heading);

    const list = document.createElement("div");
    list.className = "meal-summary-days";

    mealDays.forEach((day) => {
      const row = document.createElement("div");
      row.className = "meal-summary-day";

      const label = document.createElement("span");
      label.textContent = day.short;

      const titles = document.createElement("p");
      const recipes = plannedRecipesForDay(day.key, weekKey);
      titles.textContent = recipes.length ? recipes.map((recipe) => recipe.name).join(", ") : "No dinner planned";

      row.append(label, titles);
      list.append(row);
    });

    card.append(list);
    recipeGrid.append(card);
  });
}

function renderTgbPanel() {
  tgbQueueList.innerHTML = "";
  copyTgbEventsButton.disabled = !tgbEventQueue.length;
  clearTgbEventsButton.disabled = !tgbEventQueue.length;

  if (!tgbEventQueue.length) {
    const empty = document.createElement("li");
    empty.className = "muted-text";
    empty.textContent = "No pending TGB corrections.";
    tgbQueueList.append(empty);
    return;
  }

  tgbEventQueue.forEach((event) => {
    const item = document.createElement("li");
    const action = event.action === "deleted" ? "Deleted" : "Updated";
    item.textContent = `${action}: ${event.recipe?.name || "Recipe"} (${event.status || "queued"})`;
    tgbQueueList.append(item);
  });
}

function renderTgbEventCards() {
  recipeGrid.innerHTML = "";

  if (!tgbEventQueue.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = "<h3>No pending TGB corrections</h3><p>Recipe edits and deletions will appear here before they are captured into Open Brain.</p>";
    recipeGrid.append(empty);
    return;
  }

  tgbEventQueue.forEach((event, index) => {
    const card = document.createElement("article");
    card.className = "tgb-event-card";

    const label = document.createElement("span");
    label.className = `match-label ${event.action === "deleted" ? "missing" : "ready"}`;
    label.textContent = event.action || "queued";

    const heading = document.createElement("h3");
    heading.textContent = event.recipe?.name || `Correction ${index + 1}`;

    const body = document.createElement("pre");
    body.textContent = tgbEventText(event);

    card.append(label, heading, body);
    recipeGrid.append(card);
  });
}

function renderIngredientChips() {
  ingredientChips.innerHTML = "";

  if (!ingredients.length) {
    const empty = document.createElement("p");
    empty.className = "muted-text";
    empty.textContent = "Start with what you have on hand.";
    ingredientChips.append(empty);
    return;
  }

  ingredients.forEach((ingredient) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = titleCase(ingredient);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${ingredient}`);
    remove.textContent = "x";
    remove.addEventListener("click", () => removeIngredient(ingredient));

    chip.append(remove);
    ingredientChips.append(chip);
  });
}

function renderQuickIngredients() {
  quickIngredientsNode.innerHTML = "";

  quickIngredients.forEach((ingredient) => {
    const button = document.createElement("button");
    button.className = "quick-chip";
    button.type = "button";
    button.textContent = titleCase(ingredient);
    button.disabled = ingredients.includes(ingredient);
    button.addEventListener("click", () => addIngredients([ingredient]));
    quickIngredientsNode.append(button);
  });
}

function renderRecipeCards(matches) {
  recipeGrid.innerHTML = "";

  if (!matches.length) {
    const day = mealDays.find((item) => item.key === activeMealDay);
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML =
      activeSidebarMode === "meal"
        ? `
      <h3>No dinners planned for ${day.label}</h3>
      <p>Add recipe titles in the meal plan panel, or choose another day.</p>
    `
        : `
      <h3>No recipes found</h3>
      <p>Try a different filter, search term, or add a custom recipe that fits your kitchen.</p>
    `;
    recipeGrid.append(empty);
    return;
  }

  matches.slice(0, renderLimit).forEach((recipe) => {
    const card = recipeCardTemplate.content.firstElementChild.cloneNode(true);
    const matchLabel = card.querySelector(".match-label");
    const planMenu = card.querySelector(".plan-menu");
    const planMenuButton = card.querySelector(".plan-menu-button");
    const planDayMenu = card.querySelector(".plan-day-menu");
    const editButton = card.querySelector(".edit-recipe");
    const deleteButton = card.querySelector(".delete-recipe");
    const sourceButton = card.querySelector(".source-button");
    const sourceLink = card.querySelector(".source-link");
    const steps = card.querySelector(".steps");
    const instructionsToggle = card.querySelector(".instructions-toggle");
    const progress = card.querySelector(".progress-track span");
    const hasLocalOverride = hasLocalRecipe(recipe.id);
    const instructionText = recipe.steps || "No steps saved yet.";
    const isInstructionsExpanded = expandedRecipeIds.has(recipe.id);
    const canExpandInstructions = instructionText.length > instructionPreviewLength;
    const activeDay = mealDays.find((day) => day.key === activeMealDay);

    if (activeSidebarMode !== "meal" && hasLocalOverride) card.classList.add("custom-recipe");

    deleteButton.setAttribute("aria-label", `Delete ${recipe.name}`);
    deleteButton.addEventListener("click", () => deleteRecipe(recipe));

    editButton.setAttribute("aria-label", `Edit ${recipe.name}`);
    editButton.addEventListener("click", () => startRecipeEdit(recipe));

    planMenuButton.setAttribute("aria-label", `Add ${recipe.name} to meal plan`);
    planMenuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !planMenu.classList.contains("open");
      closePlanMenus(planMenu);
      planMenu.classList.toggle("open", willOpen);
    });

    mealDays.forEach((day) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = day.label;
      button.setAttribute("role", "menuitem");
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        activeMealDay = day.key;
        addRecipeToMealDay(day.key, recipe);
        closePlanMenus();
      });
      planDayMenu.append(button);
    });
    if (activeSidebarMode === "meal") planMenu.classList.add("hidden");

    card.querySelector(".type-pill").textContent = recipe.type;
    card.querySelector("h3").textContent = recipe.name;
    steps.textContent = instructionPreviewText(instructionText, isInstructionsExpanded);
    steps.classList.toggle("expanded", isInstructionsExpanded);
    progress.style.width = `${Math.round(recipe.score * 100)}%`;

    if (canExpandInstructions) {
      instructionsToggle.classList.add("visible");
      instructionsToggle.textContent = isInstructionsExpanded ? "Show less" : "Show more";
      instructionsToggle.setAttribute(
        "aria-label",
        `${isInstructionsExpanded ? "Collapse" : "Expand"} instructions for ${recipe.name}`
      );
      instructionsToggle.addEventListener("click", () => toggleInstructions(recipe.id));
    }

    if (recipe.sourceUrl) {
      card.classList.add("has-source");
      sourceLink.href = recipe.sourceUrl;
      sourceButton.href = recipe.sourceUrl;
      sourceButton.setAttribute("aria-label", `Open source for ${recipe.name}`);
    }

    if (activeSidebarMode === "meal") {
      matchLabel.className = "match-label ready";
      matchLabel.textContent = activeDay.short;
    } else if (activeFilter === "guided") {
      matchLabel.className = "match-label ready";
      matchLabel.textContent = "Guided";
    } else if (recipe.isReady) {
      matchLabel.className = "match-label ready";
      matchLabel.textContent = "Ready";
    } else if (recipe.isClose) {
      matchLabel.className = "match-label close";
      matchLabel.textContent = `${recipe.need.length} missing`;
    } else {
      matchLabel.className = "match-label missing";
      matchLabel.textContent = `${recipe.need.length} missing`;
    }

    makeIngredientItems(recipe.ingredientDisplay, card.querySelector(".ingredient-list"));
    recipeGrid.append(card);
  });

  if (matches.length > renderLimit) {
    const capped = document.createElement("div");
    capped.className = "empty-state result-cap";
    capped.innerHTML = `
      <h3>Showing ${renderLimit} of ${matches.length} matches</h3>
      <p>Add ingredients or search by name to narrow the full recipe set.</p>
    `;
    recipeGrid.append(capped);
  }
}

function renderSummary(matches) {
  if (activeSidebarMode === "tgb") {
    const updates = tgbEventQueue.filter((event) => event.action === "updated").length;
    const deletes = tgbEventQueue.filter((event) => event.action === "deleted").length;

    readyCount.textContent = tgbEventQueue.length;
    closeCount.textContent = updates;
    ingredientCount.textContent = deletes;
    recipeCount.textContent = tgbRecipes.length;
    readyLabel.textContent = "pending sync";
    closeLabel.textContent = "updates";
    ingredientLabel.textContent = "deletes";
    recipeLabel.textContent = "TGB recipes";
    resultsTitle.textContent = "TGB Sync";
    resultNote.textContent = tgbEventQueue.length
      ? "Copy pending correction notes, capture them into Open Brain, then mark them captured."
      : "Recipe changes will appear here as append-only Open Brain correction notes.";
    matchHeadline.textContent = "Open Brain correction queue";
    return;
  }

  if (activeSidebarMode === "meal") {
    const day = mealDays.find((item) => item.key === activeMealDay);
    const weekRecipeCount = plannedRecipeIdsForWeek().length;
    const totalIngredients = mealPlanIngredientTotals().length;

    readyCount.textContent = plannedRecipesForDay(activeMealDay).length;
    closeCount.textContent = weekRecipeCount;
    ingredientCount.textContent = totalIngredients;
    recipeCount.textContent = tgbRecipes.length;
    readyLabel.textContent = `${day.short} dinners`;
    closeLabel.textContent = "week dinners";
    ingredientLabel.textContent = "plan ingredients";
    recipeLabel.textContent = "TGB recipes";
    resultsTitle.textContent = "Meal Plan";
    if (activeMealRightView === "summary") {
      resultNote.textContent = "Reviewing the current week plus the previous 12 weeks.";
      matchHeadline.textContent = "13-week dinner history";
    } else if (activeMealRightView === "shopping") {
      resultNote.textContent = `Shopping list for ${formatWeekLabel(activeMealWeek)}.`;
      matchHeadline.textContent = "Weekly shopping list";
    } else {
      resultNote.textContent = matches.length
        ? `Showing ${day.label}'s planned dinner recipe${matches.length === 1 ? "" : "s"}.`
        : `No recipes planned for ${day.label} yet.`;
      matchHeadline.textContent = `${day.label} dinner plan`;
    }
    return;
  }

  const ready = matches.filter((recipe) => recipe.isReady).length;
  const close = matches.filter((recipe) => recipe.isClose).length;

  readyCount.textContent = ready;
  closeCount.textContent = close;
  ingredientCount.textContent = ingredients.length;
  recipeCount.textContent = tgbRecipes.length;
  readyLabel.textContent = "ready now";
  closeLabel.textContent = "almost ready";
  ingredientLabel.textContent = "ingredients listed";
  recipeLabel.textContent = "TGB recipes";
  resultsTitle.textContent = "Matches";

  if (activeFilter === "guided") {
    resultNote.textContent =
      "Showing dinner-friendly recipes with ingredients aligned to Eat to Beat Disease themes.";
    matchHeadline.textContent = "Guided recipe ideas";
    return;
  }

  if (!ingredients.length) {
    resultNote.textContent = `Loaded ${tgbRecipes.length} ${recipeSourceLabel} recipes. Add ingredients to see your best options first.`;
    matchHeadline.textContent = "Recipes ready for your ingredients";
    return;
  }

  if (ready > 0) {
    resultNote.textContent = `${ready} recipe${ready === 1 ? "" : "s"} can be made with no missing ingredients.`;
    matchHeadline.textContent = "You have enough to make these";
    return;
  }

  if (close > 0) {
    resultNote.textContent = `${close} recipe${close === 1 ? " is" : "s are"} within two ingredients.`;
    matchHeadline.textContent = "You are close to something good";
    return;
  }

  resultNote.textContent = "Best partial matches are sorted to the top.";
  matchHeadline.textContent = "Here are your nearest matches";
}

function render() {
  const isMealMode = activeSidebarMode === "meal";
  const isTgbMode = activeSidebarMode === "tgb";
  const matches = isMealMode ? getMealPlanMatches() : isTgbMode ? [] : getMatches();
  searchPanel.classList.toggle("hidden", isMealMode || isTgbMode);
  mealPlanPanel.classList.toggle("hidden", !isMealMode);
  tgbPanel.classList.toggle("hidden", !isTgbMode);
  document.querySelectorAll(".sidebar-mode").forEach((button) => {
    button.classList.toggle("active", button.dataset.sidebarMode === activeSidebarMode);
  });
  renderIngredientChips();
  renderQuickIngredients();
  renderMealPlanPanel();
  renderTgbPanel();
  renderSummary(matches);
  if (isTgbMode) {
    renderTgbEventCards();
  } else if (isMealMode && activeMealRightView === "summary") {
    renderMealSummaryCards();
  } else if (isMealMode && activeMealRightView === "shopping") {
    renderShoppingList();
  } else {
    renderRecipeCards(matches);
  }
}

ingredientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = splitIngredients(ingredientInput.value);
  if (!values.length) return;
  addIngredients(values);
  ingredientInput.value = "";
  ingredientInput.focus();
});

clearIngredientsButton.addEventListener("click", () => {
  ingredients = [];
  saveState();
  render();
});

document.addEventListener("click", () => closePlanMenus());

copyTgbEventsButton.addEventListener("click", copyTgbEventQueue);
clearTgbEventsButton.addEventListener("click", clearTgbEventQueue);

document.querySelectorAll(".sidebar-mode").forEach((button) => {
  button.addEventListener("click", () => {
    activeSidebarMode = button.dataset.sidebarMode;
    render();
  });
});

mealPlanAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const recipe = findRecipeByTitle(mealRecipeInput.value);
  if (!recipe) {
    setMealPlanStatus("Choose a recipe title from the list.", "warning");
    mealRecipeInput.focus();
    return;
  }

  addRecipeToMealDay(activeMealDay, recipe);
  mealRecipeInput.value = "";
  mealRecipeInput.focus();
});

mealWeekInput.addEventListener("change", () => {
  if (!mealWeekInput.value) return;
  activeMealWeek = mealWeekInput.value;
  currentMealPlan();
  saveState();
  render();
});

mealDayViewButton.addEventListener("click", () => {
  activeMealRightView = "day";
  render();
});

mealShoppingViewButton.addEventListener("click", () => {
  activeMealRightView = "shopping";
  render();
});

mealSummaryViewButton.addEventListener("click", () => {
  activeMealRightView = "summary";
  render();
});

toggleRecipeFormButton.addEventListener("click", () => {
  const isCollapsed = recipeForm.classList.toggle("collapsed");
  toggleRecipeFormButton.setAttribute("aria-expanded", String(!isCollapsed));
  toggleRecipeFormButton.setAttribute("aria-label", isCollapsed ? "Show add recipe form" : "Hide add recipe form");
  toggleRecipeFormButton.title = isCollapsed ? "Show add recipe form" : "Hide add recipe form";
  if (isCollapsed) resetRecipeForm();
});

cancelRecipeEditButton.addEventListener("click", resetRecipeForm);

importRecipeUrlButton.addEventListener("click", async () => {
  const url = recipeSourceUrl.value.trim();
  if (!url) {
    recipeSourceUrl.focus();
    setFormStatus("Paste a recipe URL first.", "warning");
    return;
  }

  importRecipeUrlButton.disabled = true;
  setFormStatus("Importing recipe from URL...", "neutral");

  try {
    const imported = await importRecipeFromUrl(url);
    recipeName.value = imported.name || "";
    recipeType.value = imported.type || "food";
    recipeIngredients.value = recipeDisplayIngredients(imported).join("\n");
    recipeSteps.value = imported.steps || "";
    recipeSourceUrl.value = imported.sourceUrl || url;
    setFormStatus("Imported. Review the fields, then save to add it and queue it for TGB.", "success");
  } catch (error) {
    setFormStatus(error.message, "warning");
  } finally {
    importRecipeUrlButton.disabled = false;
  }
});

recipeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = recipeName.value.trim();
  const displayIngredientsForRecipe = splitIngredientEntries(recipeIngredients.value);
  const ingredientsForRecipe = [
    ...new Set(displayIngredientsForRecipe.map(canonicalIngredient).filter((item) => item.length >= 2))
  ];

  if (!name || !ingredientsForRecipe.length) {
    recipeName.focus();
    return;
  }

  const recipe = {
    id: editingRecipeId || `custom-${Date.now()}`,
    name,
    type: recipeType.value,
    ingredients: ingredientsForRecipe,
    displayIngredients: displayIngredientsForRecipe,
    steps: recipeSteps.value.trim(),
    sourceUrl: recipeSourceUrl.value.trim()
  };

  const isEditing = Boolean(editingRecipeId);
  const previousRecipe = isEditing ? allRecipes().find((item) => item.id === recipe.id) || null : null;
  customRecipes = customRecipes.filter((item) => item.id !== recipe.id);
  customRecipes.push(recipe);
  deletedRecipeIds = deletedRecipeIds.filter((recipeId) => recipeId !== recipe.id);

  resetRecipeForm();
  saveState();
  render();

  setFormStatus(
    isEditing ? "Saved your recipe correction." : "Saved recipe. Sending structured capture to TGB bridge...",
    "neutral"
  );
  if (isEditing) {
    const tgbResult = await syncRecipeEventToTgb("updated", recipe, previousRecipe);
    setFormStatus(tgbResult.message || "Saved your recipe correction and queued it for TGB.", "success");
    return;
  }

  const tgbResult = await ingestRecipeIntoTgb(recipe);
  setFormStatus(tgbResult.message || "Saved and queued for TGB.", "success");
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    render();
  });
});

recipeSearch.addEventListener("input", () => {
  searchTerm = recipeSearch.value.trim().toLowerCase();
  render();
});

render();
loadTgbRecipes();
