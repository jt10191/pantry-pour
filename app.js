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
  tgbQueue: "pantry-pour-tgb-queue"
};

let ingredients = loadList(storeKeys.ingredients);
let customRecipes = loadRecipes();
let tgbRecipes = [...fallbackRecipes];
let recipeSourceLabel = "sample";
let activeFilter = "all";
let searchTerm = "";

const ingredientForm = document.querySelector("#ingredientForm");
const ingredientInput = document.querySelector("#ingredientInput");
const ingredientChips = document.querySelector("#ingredientChips");
const quickIngredientsNode = document.querySelector("#quickIngredients");
const clearIngredientsButton = document.querySelector("#clearIngredients");
const recipeForm = document.querySelector("#recipeForm");
const toggleRecipeFormButton = document.querySelector("#toggleRecipeForm");
const recipeName = document.querySelector("#recipeName");
const recipeType = document.querySelector("#recipeType");
const recipeIngredients = document.querySelector("#recipeIngredients");
const recipeSteps = document.querySelector("#recipeSteps");
const recipeSourceUrl = document.querySelector("#recipeSourceUrl");
const importRecipeUrlButton = document.querySelector("#importRecipeUrl");
const recipeFormStatus = document.querySelector("#recipeFormStatus");
const recipeSearch = document.querySelector("#recipeSearch");
const recipeGrid = document.querySelector("#recipeGrid");
const recipeCardTemplate = document.querySelector("#recipeCardTemplate");
const readyCount = document.querySelector("#readyCount");
const closeCount = document.querySelector("#closeCount");
const ingredientCount = document.querySelector("#ingredientCount");
const recipeCount = document.querySelector("#recipeCount");
const resultNote = document.querySelector("#resultNote");
const matchHeadline = document.querySelector("#matchHeadline");

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function titleCase(value) {
  return value.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

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

function saveState() {
  localStorage.setItem(storeKeys.ingredients, JSON.stringify(ingredients));
  localStorage.setItem(storeKeys.recipes, JSON.stringify(customRecipes));
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

function splitIngredients(value) {
  return value
    .split(/,|\n/)
    .map(normalize)
    .filter(Boolean);
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

function deleteRecipe(recipeId) {
  customRecipes = customRecipes.filter((recipe) => recipe.id !== recipeId);
  saveState();
  render();
}

function setFormStatus(message, tone = "neutral") {
  recipeFormStatus.textContent = message;
  recipeFormStatus.dataset.tone = tone;
}

function formatTgbRecipeThought(recipe) {
  const ingredientsText = recipe.ingredients.map((ingredient) => `- ${titleCase(ingredient)}`).join("\n");
  const sourceText = recipe.sourceUrl ? `\nSource URL: ${recipe.sourceUrl}` : "";
  const stepsText = recipe.steps ? `\nSteps: ${recipe.steps}` : "";

  return `Recipe captured for Pantry Pour / TGB.
Name: ${recipe.name}
Type: ${recipe.type}${sourceText}
Ingredients:
${ingredientsText}${stepsText}`;
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

function allRecipes() {
  return [...tgbRecipes, ...customRecipes];
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

function getMatches() {
  const pantry = new Set(ingredients);

  return allRecipes()
    .map((recipe) => {
      const recipeIngredients = recipe.ingredients.map(normalize);
      const have = recipeIngredients.filter((item) => pantry.has(item));
      const need = recipeIngredients.filter((item) => !pantry.has(item));
      const score = recipeIngredients.length ? have.length / recipeIngredients.length : 0;

      return {
        ...recipe,
        ingredients: recipeIngredients,
        have,
        need,
        score,
        isReady: need.length === 0,
        isClose: need.length > 0 && need.length <= 2
      };
    })
    .filter((recipe) => activeFilter === "all" || recipe.type === activeFilter)
    .filter((recipe) => {
      if (!searchTerm) return true;
      const haystack = [recipe.name, recipe.type, ...recipe.ingredients].join(" ").toLowerCase();
      return haystack.includes(searchTerm);
    })
    .sort((a, b) => {
      if (b.isReady !== a.isReady) return Number(b.isReady) - Number(a.isReady);
      if (b.score !== a.score) return b.score - a.score;
      return a.need.length - b.need.length || a.name.localeCompare(b.name);
    });
}

function makeListItems(list, node) {
  node.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = titleCase(item);
    node.append(li);
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
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <h3>No recipes found</h3>
      <p>Try a different filter, search term, or add a custom recipe that fits your kitchen.</p>
    `;
    recipeGrid.append(empty);
    return;
  }

  matches.forEach((recipe) => {
    const card = recipeCardTemplate.content.firstElementChild.cloneNode(true);
    const matchLabel = card.querySelector(".match-label");
    const deleteButton = card.querySelector(".delete-recipe");
    const sourceLink = card.querySelector(".source-link");
    const progress = card.querySelector(".progress-track span");

    if (recipe.id.startsWith("custom-")) {
      card.classList.add("custom-recipe");
      deleteButton.setAttribute("aria-label", `Delete ${recipe.name}`);
      deleteButton.addEventListener("click", () => deleteRecipe(recipe.id));
    }

    card.querySelector(".type-pill").textContent = recipe.type;
    card.querySelector("h3").textContent = recipe.name;
    card.querySelector(".steps").textContent = recipe.steps || "No steps saved yet.";
    progress.style.width = `${Math.round(recipe.score * 100)}%`;

    if (recipe.sourceUrl) {
      card.classList.add("has-source");
      sourceLink.href = recipe.sourceUrl;
    }

    if (recipe.isReady) {
      matchLabel.className = "match-label ready";
      matchLabel.textContent = "Ready";
    } else if (recipe.isClose) {
      matchLabel.className = "match-label close";
      matchLabel.textContent = `${recipe.need.length} missing`;
    } else {
      matchLabel.className = "match-label missing";
      matchLabel.textContent = `${recipe.need.length} missing`;
    }

    makeListItems(recipe.have, card.querySelector(".have-list"));
    makeListItems(recipe.need, card.querySelector(".need-list"));
    recipeGrid.append(card);
  });
}

function renderSummary(matches) {
  const ready = matches.filter((recipe) => recipe.isReady).length;
  const close = matches.filter((recipe) => recipe.isClose).length;

  readyCount.textContent = ready;
  closeCount.textContent = close;
  ingredientCount.textContent = ingredients.length;
  recipeCount.textContent = tgbRecipes.length;

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
  const matches = getMatches();
  renderIngredientChips();
  renderQuickIngredients();
  renderSummary(matches);
  renderRecipeCards(matches);
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

toggleRecipeFormButton.addEventListener("click", () => {
  const isCollapsed = recipeForm.classList.toggle("collapsed");
  toggleRecipeFormButton.setAttribute("aria-expanded", String(!isCollapsed));
  toggleRecipeFormButton.setAttribute("aria-label", isCollapsed ? "Show add recipe form" : "Hide add recipe form");
  toggleRecipeFormButton.title = isCollapsed ? "Show add recipe form" : "Hide add recipe form";
});

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
    recipeIngredients.value = (imported.ingredients || []).join(", ");
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
  const ingredientsForRecipe = splitIngredients(recipeIngredients.value);

  if (!name || !ingredientsForRecipe.length) {
    recipeName.focus();
    return;
  }

  const recipe = {
    id: `custom-${Date.now()}`,
    name,
    type: recipeType.value,
    ingredients: ingredientsForRecipe,
    steps: recipeSteps.value.trim(),
    sourceUrl: recipeSourceUrl.value.trim()
  };

  customRecipes.push(recipe);

  recipeForm.reset();
  saveState();
  render();

  setFormStatus("Saved recipe. Sending structured capture to TGB bridge...", "neutral");
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
