/**
 * INGREDIENTS ROUTES (v2)
 * 
 * New endpoints:
 * - /search    - searches BOTH ingredients + branded foods (main endpoint)
 * - /base      - searches base ingredients only
 * - /branded   - searches branded foods only
 * - /:id       - get single ingredient
 */

const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredientsController");

// Main search - searches both ingredients AND branded foods
// GET /api/ingredients/search?q=monster
router.get("/search", ingredientsController.search);

// Base ingredients only (for when you need core ingredients)
// GET /api/ingredients/base?q=milk
router.get("/base", ingredientsController.searchBase);

// Branded foods only
// GET /api/ingredients/branded?q=red%20bull
router.get("/branded", ingredientsController.searchBranded);

// Get single ingredient by ID
// GET /api/ingredients/123abc
router.get("/:id", ingredientsController.getById);

module.exports = router;