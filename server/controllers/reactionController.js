const reactionService = require("../services/reactionService");

const getReactionByDay = async (req, res) => {
  try {
    const userId = req.user;
    const { date, page, limit } = req.query;

    const reactions = await reactionService.getReactionByDay(
      userId,
      date,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );

    res.json(reactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dailyStats = async (req, res) => {
  try {
    const userId = req.user;
    const { date, tzOffset } = req.query;

    const stats = await reactionService.dailyStats(userId, date, tzOffset);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReaction = async (req, res) => {
  try {
    const { mealLogId } = req.query;
    const reactions = await reactionService.getReaction(mealLogId);
    res.json(reactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReaction = async (req, res) => {
  try {
    const userId = req.user;
    const reaction = await reactionService.createReaction(userId, req.body);
    res.json(reaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getSuspectedFoods(req, res) {
  try {
    const userId = req.user;
    const result = await reactionService.getSuspectedFoods(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMonthlyAnalysis(req, res) {
  try {
    const userId = req.user;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const result = await reactionService.getMonthlyAnalysis(
      userId,
      parseInt(year),
      parseInt(month)
    );
    res.json(result);
  } catch (err) {
    console.error("Monthly analysis error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getReactionByDay,
  createReaction,
  getReaction,
  dailyStats,
  getSuspectedFoods,
  getMonthlyAnalysis,
};