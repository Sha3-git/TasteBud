const reactionService = require("../services/reactionService")

const getReactionByDay = async (req, res) => {
  try{
    const { userId, date, page, limit } = req.query;
    const reactions = await reactionService.getReactionByDay(userId, date, parseInt(page) || 1, parseInt(limit) || 10);
    res.json(reactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createReaction = async (req, res) =>{
  try{
    const { userId } = req.query;
    const reaction = await reactionService.createReaction(userId, req.body);
    res.json(reaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
    getReactionByDay,
    createReaction
}