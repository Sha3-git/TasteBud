const BrandedFood = require("../models/brandedFood");

const searchBrandedFoods = async (query, limit = 20) => {
  try {
    let results = await BrandedFood.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit);

    if (results.length === 0) {
      const regex = new RegExp(query, "i");

      results = await BrandedFood.find({
        $or: [
          { description: regex },
          { ingredients: regex },
          { brandName: regex },
          { brandOwner: regex }
        ]
      }).limit(limit);
    }

    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  searchBrandedFoods
};
