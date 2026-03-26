const Crossreaction = require("../models/crossReaction");
const Ingredient = require("../models/ingredients");
const mongoose = require("mongoose");


const getCrossReactions = async (ingredientId) => {
  let crossReactions = await Crossreaction.find({ ingredient: ingredientId });
  
  if (crossReactions.length > 0) {
    return crossReactions;
  }
  
  const db = mongoose.connection.db;
  const mappingsCollection = db.collection("ingredient_mappings");
  const ingredientsCollection = db.collection("ingredients");
  
  let ingredientName = null;
  
  try {
    const objectId = new mongoose.Types.ObjectId(ingredientId);
    
    const mapping = await mappingsCollection.findOne({ matchedId: objectId });
    if (mapping) {
      ingredientName = mapping.matchedName;
    } else {
      const ingredient = await ingredientsCollection.findOne({ _id: objectId });
      if (ingredient) {
        ingredientName = ingredient.name;
      }
    }
  } catch (err) {
    console.error("Error resolving ingredient name:", err.message);
  }
  
  if (!ingredientName) {
    return [];
  }
  
  crossReactions = await Crossreaction.find({
    ingredientName: { $regex: new RegExp(`^${escapeRegex(ingredientName)}$`, 'i') }
  });
  
  return crossReactions;
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { getCrossReactions };