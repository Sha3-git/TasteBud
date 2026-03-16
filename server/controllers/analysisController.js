const analysisService = require("../services/analysisService");
async function getSuspectedFoods(req, res) {
  try {
    console.log("User ID for suspected foods");

    const userId = req.user;
    const result = await analysisService.getSuspectedFoods(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function getSuspectedFoodsTest(req, res) {
  try {
    console.log("User ID for suspected foods");
    const { userId } = req.query
    const result = await analysisService.getSuspectedFoods(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getSuspectedFoods, getSuspectedFoodsTest 
};