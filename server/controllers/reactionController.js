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

const getReaction = async (req, res) => {
  try{
    const { mealLogid } = req.query;
    const reactions = await reactionService.getReaction(mealLogid);
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

// Update reaction
const updateReaction = async (req, res) => {
  try {
    const updatedReaction = await reactionService.updateReaction(req.params.id, req.body);
    if (!updatedReaction) return res.status(404).json({ error: "Reaction not found" });
    res.status(200).json(updatedReaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete reaction
const deleteReaction = async (req, res) => {
  try {
    const deletedReaction = await reactionService.deleteReaction(req.params.id);
    if (!deletedReaction) return res.status(404).json({ error: "Reaction not found" });
    res.status(200).json(deletedReaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


module.exports = {
    getReactionByDay,
    createReaction,
    getReaction,
    updateReaction,
    deleteReaction
}