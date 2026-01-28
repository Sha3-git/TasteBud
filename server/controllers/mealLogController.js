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

const getMealLogByDay = async (req, res) => {
  try{
    const { userId, date, page, limit } = req.query;
    const meals = await mealService.getMealLogByDay(userId, date, parseInt(page) || 1, parseInt(limit) || 10);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMealLogByWeek = async (req, res) => {
  try{
    const { userId, date, page, limit } = req.query;
    const meals = await mealService.getMealLogByWeek(userId, date, parseInt(page) || 1, parseInt(limit) || 10);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs,
  getMealLogByDay,
  getMealLogByWeek
}