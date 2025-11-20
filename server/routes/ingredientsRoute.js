const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredientsController");

router.get("/search", ingredientsController.search);

module.exports = router;
