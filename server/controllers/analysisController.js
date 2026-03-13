const analysisService = require("../services/analysisService");
async function getSuspectedFoods(req, res) {
  try {
    const { userId } = req.query
    const result = await analysisService.getSuspectedFoods(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getSuspectedFoods 
};