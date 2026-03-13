const mealService = require("../services/mealLogService");

const createMealLog = async (req, res) => {
  try {
    const userId = req.user;
    console.log(req.body.hadReaction);

    if (!req.body.mealName) {
      return res.status(400).json({ error: "mealName is required" });
    }
    if (req.body.hadReaction === undefined) {
      return res.status(400).json({ error: "hadReaction is required" });
    }

    const mealLog = await mealService.createMealLog(userId, req.body);
    console.log("Created meal log:", mealLog);
    res.status(201).json(mealLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create meal log"
    });
  }
};

const updateMealLog = async (req, res) => {
  try {
    const updatedMealLog = await mealService.updateMealLog(req.params.id, req.body);
    if (!updatedMealLog) return res.status(404).json({ error: "Meal not found" });
    res.status(200).json(updatedMealLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
    const userId = req.user;
    const { date, tzOffset } = req.query;

    const stats = await mealService.dailyStats(userId, date, tzOffset);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMealLogs = async (req, res) => {
  try {
    const userId = req.user;
    const mealLog = await mealService.getMealLogs(userId); // make sure your service filters by user
    res.json(mealLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMealLogByDay = async (req, res) => {
  try {
    const userId = req.user;
    const { date, page, limit, tzOffset } = req.query;

    if (!date) return res.status(400).json({ error: "date is required" });

    const meals = await mealService.getMealLogByDay(
      userId,
      date,
      parseInt(page) || 1,
      parseInt(limit) || 100,
      tzOffset
    );

    res.status(200).json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meal logs" });
  }
};

const getMealLogByWeek = async (req, res) => {
  try {
    const userId = req.user;
    const { date, page, limit } = req.query;

    const meals = await mealService.getMealLogByWeek(
      userId,
      date,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );

    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMealLogByMonth = async (req, res) => {
  try {
    const userId = req.user;
    const { year, month, page, limit, tzOffset } = req.query;

    const meals = await mealService.getMealLogByMonth(
      userId,
      year,
      month,
      parseInt(page) || 1,
      parseInt(limit) || 10,
      tzOffset
    );

    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs,
  getMealLogByDay,
  getMealLogByWeek,
  getMealLogByMonth,
  dailyStats
};