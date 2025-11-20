const express = require("express");
const router = express.Router();

const mealLogController = require("../controllers/mealLogController")

router.post("/create", mealLogController.createMealLog);
router.put("/update/:id", mealLogController.updateMealLog);
router.delete("/delete/:id", mealLogController.deleteMealLog);
router.get("/get/:id", mealLogController.getMealLogs)
module.exports = router