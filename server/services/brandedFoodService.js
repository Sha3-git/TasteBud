const BrandedFood = require("../models/brandedFoods");

const searchBrandedFoods = async (query, limit = 20) => {
  const search = query.trim();
  if (!search) return [];

  try {
    let results = await BrandedFood.find(
      { $text: { $search: search } },
      {
        score: { $meta: "textScore" },
        description: 1,
        brandOwner: 1,
        brandedFoodCategory: 1
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();

    if (results.length > 0) return results;

    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //dont remove this pls it prevents regex injection that makes the database go boom
    const prefixRegex = new RegExp(`^${escaped}`, "i");

    results = await BrandedFood.find(
      { description: prefixRegex },
      {
        description: 1,
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
/*
db.brandedfoods.createIndex(
  { description: "text", brandedFoodCategory: "text", brandOwner: "text" },
  { weights: { description: 2, brandedFoodCategory: 4, brandOwner: 1 }, name: "FoodTextIndex" }
);

db.brandedfoods.createIndex({ description: 1 });

*/
module.exports = { searchBrandedFoods };
