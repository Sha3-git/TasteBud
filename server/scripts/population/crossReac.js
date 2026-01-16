const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const Crossreaction = require("../../models/crossReaction");
const Ingredient = require("../../models/ingredients");

const FILE_PATH =
  "C:/Users/dabir/OneDrive/Documents/GitHub/TasteBud/server/data/cross_reac.json";

const normalize = (str = "") =>
  str.toLowerCase().trim();


const buildIngredientMap = async () => {
  const ingredients = await Ingredient.find(
    {},
    { name: 1, aliases: 1 }
  );

  const map = new Map();

  ingredients.forEach((ing) => {
    if (ing.name) {
      map.set(normalize(ing.name), ing._id);
    }

    if (Array.isArray(ing.aliases)) {
      ing.aliases.forEach(alias => {
        map.set(normalize(alias), ing._id);
      });
    }
  });

  console.log(`Loaded ${map.size} ingredient name mappings`);
  return map;
};


const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const ingredientMap = await buildIngredientMap();

  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  const json = JSON.parse(raw);

  const flatData = json.flat();

  const docs = [];

  for (const item of flatData) {
    const mainIngredientId =
      ingredientMap.get(normalize(item.name));

    if (!mainIngredientId) {
      console.warn(`Skipping ${item.name} (ingredient not found)`);
      continue;
    }

    const similarities = [];

    for (const [name, score] of Object.entries(item.similarity_scores || {})) {
      const ingId = ingredientMap.get(normalize(name));
      if (!ingId) continue;

      similarities.push({
        ingredient: ingId,
        name,      
        score
      });
    }

    if (!similarities.length) continue;

    docs.push({
      name: item.name,
      scientificName: item.scientific_name,
      proteinSequence: item.protein_sequence,
      ingredient: mainIngredientId,
      similarities
    });
  }

  await Crossreaction.insertMany(docs, { ordered: false });

  console.log(`${docs.length} cross-reaction documents`);

  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});