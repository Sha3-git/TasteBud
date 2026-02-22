/**
 * UPGRADED INGREDIENTS CONTROLLER
 * 
 * Endpoints:
 * GET /api/ingredients/search?q=xxx&limit=10&ingredientSkip=0&brandedSkip=0
 * GET /api/ingredients/base?q=xxx&limit=20&skip=0
 * GET /api/ingredients/branded?q=xxx&limit=20&skip=0
 * GET /api/ingredients/:id
 */

const ingredientsService = require("../services/ingredientsService");

/**
 * Search both ingredients and branded foods
 * Returns: { ingredients, branded, ingredientsTotal, brandedTotal }
 */
async function search(req, res) {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    const ingredientSkip = parseInt(req.query.ingredientSkip) || 0;
    const brandedSkip = parseInt(req.query.brandedSkip) || 0;
    
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const results = await ingredientsService.searchIngredients(
      query, 
      limit, 
      ingredientSkip, 
      brandedSkip
    );
    
    res.json(results);
    
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Search base ingredients only
 */
async function searchBase(req, res) {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const results = await ingredientsService.searchBaseIngredients(query, limit, skip);
    res.json(results);
    
  } catch (err) {
    console.error("Base search error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Search branded foods only
 */
async function searchBranded(req, res) {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const results = await ingredientsService.searchBrandedFoods(query, limit, skip);
    res.json(results);
    
  } catch (err) {
    console.error("Branded search error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Get single ingredient by ID
 */
async function getById(req, res) {
  try {
    const { id } = req.params;
    
    const ingredient = await ingredientsService.getIngredientById(id);
    
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    
    res.json(ingredient);
    
  } catch (err) {
    console.error("Get by ID error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  search,
  searchBase,
  searchBranded,
  getById
};