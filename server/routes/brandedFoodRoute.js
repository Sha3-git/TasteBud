const express = require("express");
const router = express.Router();
const controller = require("../controllers/brandedFoodController");

router.get("/search", /*(--> insert auth middleware here)*/ controller.searchFoods);

router.get("/ingredients/:id", controller.getBrandedFoodIngredients);
module.exports = router;
