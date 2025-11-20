const Ingredient = require("../models/ingredients");

const searchIngredients = async (query, limit = 20) => {
  try {
    if (!query || query.trim() === "") return [];

    const q = query.trim();

    let results = await Ingredient.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit);

    if (results.length === 0) {
      const regex = new RegExp(q, "i");
      results = await Ingredient.find({
        $or: [
          { name: regex },
          { scientificName: regex }
        ]
      }).limit(limit);
    }

    return results;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  searchIngredients
};
