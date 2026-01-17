const crossReactionService = require("../services/crossReactionService");

const getCrossReactions = async (req, res) =>{
    try{
        const crossReactions = await crossReactionService.getCrossReactions(req.params.ingredientId)
        res.status(201).json(crossReactions);
    }
     catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getCrossReactions
}