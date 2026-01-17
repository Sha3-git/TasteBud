const Crossreaction = require("../models/crossReaction");
const Ingredient = require("../models/ingredients");

const getCrossReactions = async (ingredientId) => {
        const crossReactions = await Crossreaction.find({ ingredient: ingredientId })
        return crossReactions;
}

module.exports= {getCrossReactions}