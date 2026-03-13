const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredientsController");

router.get("/search", ingredientsController.search);
router.get("/base", ingredientsController.searchBase);
router.get("/branded", ingredientsController.searchBranded);
router.get("/:id", ingredientsController.getById);

module.exports = router;