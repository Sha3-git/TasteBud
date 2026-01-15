const express = require("express");
const router = express.Router();

const unsafeFoodController = require("../controllers/unsafeFoodsController")
router.post("/create", unsafeFoodController.createUnsafeFood)

module.exports = router