const UnsafeFood = require("../models/unsafeFoods");
const Ingredient = require("../models/ingredients");

const getUnsafeFoods = async (userId) => {
    const result = await UnsafeFood.findOne({ userId: userId })
        .populate("ingredients.ingredient");
    return result;
};

const createUnsafeFood = async (userId, data) => {
    return await UnsafeFood.findOneAndUpdate(
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
    ).populate({
        path: "ingredients.ingredient",
        select: "name foodGroup foodSubgroup"
    });
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
    ).populate("ingredients.ingredient");
    return result;
};

const deleteUnsafeFood = async (id, body) => {
    const { ingredient } = body;
    return await UnsafeFood.findByIdAndUpdate(
        id,
        {
            $pull: {
                ingredients: { ingredient }
            }
        },
        { new: true }
    ).populate("ingredients.ingredient");
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
    ).populate("ingredients.ingredient", "name foodGroup");

    return result;
};

module.exports = {
    getUnsafeFoods,
    createUnsafeFood,
    updateUnsafeFood,
    deleteUnsafeFood,
    saveOnboardingAllergies
};
