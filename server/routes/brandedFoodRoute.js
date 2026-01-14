const express = require("express");
const router = express.Router();
const controller = require("../controllers/brandedFoodController");

router.get("/search", /*(--> insert auth middleware here)*/ controller.searchFoods);

module.exports = router;
