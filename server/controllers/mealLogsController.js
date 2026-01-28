const mealService = require("../services/mealLogService");

const createMealLog = async (req, res) => {
  try {
    const { userId } = req.query // const userId = req.user;
    const mealLog = await mealService.createMealLog(userId, req.body);
    res.status(201).json(mealLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const updateMealLog = async (req, res) => {
  try {
    const updatedMealLog = await mealService.updateMealLog(req.params.id, req.body);
    if (!updatedMealLog) return res.status(404).json({ error: "Meal not found" });
    res.status(200).json(updatedMealLog)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const deleteMealLog = async (req, res) => {
  try {
    const deletedMealLog = await mealService.deleteMealLog(req.params.id);
    if (!deletedMealLog) return res.status(404).json({ error: "Meal not found" });

    res.status(200).json(deletedMealLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const dailyStats = async (req, res) => {
  try {
    const { userId, date, tzOffset } = req.query;
    const stats = await mealService.dailyStats(userId, date, tzOffset);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getMealLogs = async (req, res) => {
  try {
    const mealLog = await mealService.getMealLogs();
    res.json(mealLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMealLogByDay = async (req, res) => {
  try {
    const { userId, date, page, limit, tzOffset } = req.query;
    const meals = await mealService.getMealLogByDay(userId, date, parseInt(page) || 1, parseInt(limit) || 100, tzOffset);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMealLogByWeek = async (req, res) => {
  try {
    const { userId, date, page, limit } = req.query;
    const meals = await mealService.getMealLogByWeek(userId, date, parseInt(page) || 1, parseInt(limit) || 10);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMealLogByMonth = async (req, res) => {
  try {
    const { userId, year, month, page, limit, tzOffset } = req.query;
    const meals = await mealService.getMealLogByMonth(userId, year, month, parseInt(page) || 1, parseInt(limit) || 10, tzOffset);
    res.json(meals);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs,
  getMealLogByDay,
  getMealLogByWeek,
  getMealLogByMonth,
  dailyStats
}