const mealService = require("../services/mealLogService");

const createMealLog = async (req, res) => {
    try {
        const mealLog = await mealService.createMealLog(req.body);
        res.status(201).json(mealLog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const updateMealLog = async (req, res) => {
    try {
        const updatedMealLog = await mealService.updateMealLog(req.params.id, req.body);
        if (!updatedMealLog) return res.status(404).json({ error: "Meal not found" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteMealLog = async (req, res) => {
  try {
    const deletedMealLog = await mealService.deleteMealLog(req.params.id);
    if (!deletedMealLog) return res.status(404).json({ error: "Meal not found" });

     res.status(201).json(deletedMealLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMealLogs = async (req, res) => {
  try {
    const mealLog = await mealService.getMealLogs();
    res.json(mealLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs
}