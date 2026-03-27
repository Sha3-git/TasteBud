const BrandedFood = require("../models/brandedFoods");
const Ingredient = require("../models/ingredients");
const mongoose = require("mongoose");
const searchBrandedFoods = async (query, limit = 20) => {
  const search = query.trim();
  if (!search) return [];

  try {
    let results = await BrandedFood.find(
      { $text: { $search: search } },
      {
        score: { $meta: "textScore" },
        description: 1,
        ingredients: 1,
        brandOwner: 1,
        brandedFoodCategory: 1
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();

    if (results.length > 0) return results;

    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^${escaped}`, "i");

    results = await BrandedFood.find(
      { description: prefixRegex },
      {
        description: 1,
        ingredients: 1,
        brandOwner: 1,
        brandedFoodCategory: 1
      }
    )
      .limit(limit)
      .lean();

    return results;
  } catch (err) {
    console.error("Branded food search error:", err);
    throw err;
  }
};

const getBrandedFoodWithIngredients = async (brandedFoodId) => {
  const brandedFood = await BrandedFood.findById(brandedFoodId).lean();
  if (!brandedFood) return null;

  const mappedIngredients = [];
  const seenIds = new Set();
  
  const db = mongoose.connection.db;
  const mappingsCollection = db.collection("ingredient_mappings");

  for (const rawIngredient of brandedFood.ingredients || []) {
    if (!rawIngredient || rawIngredient.length < 2) continue;
    
    try {
      const mapping = await mappingsCollection.findOne({ original: rawIngredient });
      
      if (mapping && mapping.matchedId) {
        const idString = mapping.matchedId.toString();
        if (!seenIds.has(idString)) {
          seenIds.add(idString);
          mappedIngredients.push({
            id: mapping.matchedId,
            name: mapping.matchedName,
            originalName: rawIngredient,
            similarity: mapping.similarity,
            foodGroup: mapping.foodGroup || ""
          });
        }
      }
    } catch (err) {
      console.error(`Error looking up mapping for "${rawIngredient}":`, err.message);
    }
  }

  return {
    ...brandedFood,
    mappedIngredients,
    mappingMethod: "ai-embeddings"  
  };
};

const getMappingStats = async () => {
  const db = mongoose.connection.db;
  const mappingsCollection = db.collection("ingredient_mappings");
  
  const totalMappings = await mappingsCollection.countDocuments();
  const avgSimilarity = await mappingsCollection.aggregate([
    { $group: { _id: null, avg: { $avg: "$similarity" } } }
  ]).toArray();
  
  const topMatches = await mappingsCollection.find()
    .sort({ similarity: -1 })
    .limit(10)
    .toArray();
  
  const lowMatches = await mappingsCollection.find()
    .sort({ similarity: 1 })
    .limit(10)
    .toArray();
  
  return {
    totalMappings,
    averageSimilarity: avgSimilarity[0]?.avg || 0,
    topMatches,
    lowMatches
  };
};

module.exports = { 
  searchBrandedFoods, 
  getBrandedFoodWithIngredients,
  getMappingStats 
};