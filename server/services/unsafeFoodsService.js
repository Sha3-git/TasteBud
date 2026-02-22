const UnsafeFood = require("../models/unsafeFoods");
const Ingredient = require("../models/ingredients");
const mongoose = require("mongoose");

/**
 * Resolve ingredient IDs to full ingredient info
 * Looks up from ingredient_mappings first, then ingredients, then branded_foods
 */
async function resolveIngredientInfo(ingredientId) {
  if (!ingredientId) return null;
  
  const db = mongoose.connection.db;
  const mappingsCollection = db.collection("ingredient_mappings");
  const ingredientsCollection = db.collection("ingredients");
  const brandedCollection = db.collection("branded_foods");
  
  const idString = typeof ingredientId === 'string' ? ingredientId : ingredientId.toString();
  
  try {
    const objectId = new mongoose.Types.ObjectId(idString);
    
    // First try ingredient_mappings
    const mapping = await mappingsCollection.findOne({ matchedId: objectId });
    
    if (mapping) {
      // Try to get full ingredient data from ingredients collection
      const fullIngredient = await ingredientsCollection.findOne({ 
        name: { $regex: new RegExp(`^${escapeRegex(mapping.matchedName)}$`, 'i') }
      });
      
      return {
        _id: idString,
        name: mapping.matchedName,
        foodGroup: fullIngredient?.foodGroup || mapping.foodGroup || 'Other',
        foodSubgroup: fullIngredient?.foodSubgroup || null,
      };
    }
    
    // Try direct lookup in ingredients collection
    const ingredient = await ingredientsCollection.findOne({ _id: objectId });
    
    if (ingredient) {
      return {
        _id: idString,
        name: ingredient.name,
        foodGroup: ingredient.foodGroup || 'Other',
        foodSubgroup: ingredient.foodSubgroup || null,
      };
    }
    
    // Try branded_foods collection
    const branded = await brandedCollection.findOne({ _id: objectId });
    
    if (branded) {
      return {
        _id: idString,
        name: branded.name || branded.description || 'Unknown Product',
        foodGroup: branded.brandedFoodCategory || branded.brandOwner || 'Branded Product',
        foodSubgroup: null,
      };
    }
    
    return null;
    
  } catch (err) {
    console.error("Error resolving ingredient:", idString, err.message);
    return null;
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getUnsafeFoods = async (userId) => {
  // Get the document without populate (it will fail anyway)
  const result = await UnsafeFood.findOne({ userId: userId }).lean();
  
  if (!result || !result.ingredients) {
    return result;
  }
  
  // Manually resolve each ingredient
  const resolvedIngredients = await Promise.all(
    result.ingredients.map(async (item) => {
      const ingredientInfo = await resolveIngredientInfo(item.ingredient);
      return {
        ...item,
        ingredient: ingredientInfo
      };
    })
  );
  
  // Filter out items where ingredient couldn't be resolved
  result.ingredients = resolvedIngredients.filter(item => item.ingredient !== null);
  
  return result;
};

const createUnsafeFood = async (userId, data) => {
  const result = await UnsafeFood.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $push: {
        ingredients: {
          ingredient: data.ingredient,
          status: data.status,
          preExisting: data.preExisting,
        },
      },
    },
    {
      upsert: true,
      new: true,
    }
  ).lean();
  
  // Resolve ingredients manually
  if (result && result.ingredients) {
    result.ingredients = await Promise.all(
      result.ingredients.map(async (item) => {
        const ingredientInfo = await resolveIngredientInfo(item.ingredient);
        return { ...item, ingredient: ingredientInfo };
      })
    );
    result.ingredients = result.ingredients.filter(item => item.ingredient !== null);
  }
  
  return result;
};

const updateUnsafeFood = async (id, body) => {
  const { ingredient, status, preExisting } = body;
  const set = {};
  if (status !== undefined) {
    set["ingredients.$.status"] = status;
  }
  if (preExisting !== undefined) {
    set["ingredients.$.preExisting"] = preExisting;
  }
  if (!Object.keys(set).length) return null;
  
  const result = await UnsafeFood.findOneAndUpdate(
    { _id: id, "ingredients.ingredient": ingredient },
    { $set: set },
    { new: true }
  ).lean();
  
  // Resolve ingredients manually
  if (result && result.ingredients) {
    result.ingredients = await Promise.all(
      result.ingredients.map(async (item) => {
        const ingredientInfo = await resolveIngredientInfo(item.ingredient);
        return { ...item, ingredient: ingredientInfo };
      })
    );
    result.ingredients = result.ingredients.filter(item => item.ingredient !== null);
  }
  
  return result;
};

const deleteUnsafeFood = async (id, body) => {
  const { ingredient } = body;
  const result = await UnsafeFood.findByIdAndUpdate(
    id,
    {
      $pull: {
        ingredients: { ingredient }
      }
    },
    { new: true }
  ).lean();
  
  // Resolve ingredients manually
  if (result && result.ingredients) {
    result.ingredients = await Promise.all(
      result.ingredients.map(async (item) => {
        const ingredientInfo = await resolveIngredientInfo(item.ingredient);
        return { ...item, ingredient: ingredientInfo };
      })
    );
    result.ingredients = result.ingredients.filter(item => item.ingredient !== null);
  }
  
  return result;
};

/**
 * Save allergies declared during onboarding
 * Searches for matching ingredients and marks them as preExisting
 */
const saveOnboardingAllergies = async (userId, allergyNames) => {
  if (!allergyNames || allergyNames.length === 0) {
    return { message: "No allergies to save", ingredients: [] };
  }
  const matchedIngredients = [];
  
  for (const name of allergyNames) {
    const ingredient = await Ingredient.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { allergens: { $regex: new RegExp(name, 'i') } },
        { aliases: { $regex: new RegExp(`^${name}$`, 'i') } }
      ]
    });
    
    if (ingredient) {
      matchedIngredients.push({
        ingredient: ingredient._id,
        status: "confirmed",
        preExisting: true
      });
    }
  }
  
  if (matchedIngredients.length === 0) {
    return { message: "No matching ingredients found", ingredients: [] };
  }
  
  const result = await UnsafeFood.findOneAndUpdate(
    { userId: userId },
    {
      $addToSet: {
        ingredients: { $each: matchedIngredients }
      }
    },
    {
      upsert: true,
      new: true
    }
  ).lean();
  
  // Resolve ingredients manually
  if (result && result.ingredients) {
    result.ingredients = await Promise.all(
      result.ingredients.map(async (item) => {
        const ingredientInfo = await resolveIngredientInfo(item.ingredient);
        return { ...item, ingredient: ingredientInfo };
      })
    );
    result.ingredients = result.ingredients.filter(item => item.ingredient !== null);
  }
  
  return result;
};

module.exports = {
  getUnsafeFoods,
  createUnsafeFood,
  updateUnsafeFood,
  deleteUnsafeFood,
  saveOnboardingAllergies
};