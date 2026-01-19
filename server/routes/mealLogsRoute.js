const express = require("express");
const router = express.Router();

const mealLogController = require("../controllers/mealLogsController")

router.post("/create", mealLogController.createMealLog);
router.put("/update/:id", mealLogController.updateMealLog); 
router.delete("/delete/:id", mealLogController.deleteMealLog);
router.get("/get/:id", mealLogController.getMealLogs)
router.get("/daily", mealLogController.getMealLogByDay);
router.get("/weekly", mealLogController.getMealLogByWeek);
router.get("/monthly", mealLogController.getMealLogByMonth);

module.exports = router