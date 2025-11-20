const brandedFoodService = require("../services/brandedFoodService");

const searchFoods = async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) return res.status(400).json({ error: "Missing search query" });

    const results = await brandedFoodService.searchBrandedFoods(q, limit);

    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  searchFoods
};
