const express = require("express");
const router = express.Router();

const unsafeFoodController = require("../controllers/unsafeFoodsController")
router.post("/create", unsafeFoodController.createUnsafeFood)
router.get("/get",  unsafeFoodController.getUnsafeFoods) 
router.put("/update/:id", unsafeFoodController.updateUnsafeFood)

module.exports = router