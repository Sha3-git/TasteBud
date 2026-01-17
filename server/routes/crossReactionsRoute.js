const express = require("express");
const router = express.Router();

const crossReactionsController = require("../controllers/crossReactionsController")

router.get("/get/:ingredientId", crossReactionsController.getCrossReactions);

module.exports = router;