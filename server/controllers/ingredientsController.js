const ingredientsService = require("../services/ingredientsService");

async function search(req, res) {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const results = await ingredientsService.searchIngredients(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  search
};
