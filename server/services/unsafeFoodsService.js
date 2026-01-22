const UnsafeFood = require("../models/unsafeFoods");

const getUnsafeFoods = async (userId) => {
    
    const result = await UnsafeFood.findOne({ userId: userId })
        .populate("ingredients.ingredient")
        return result;
};

const createUnsafeFood = async (
    userId,
    data   
) => {
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
    ).populate({path: "ingredients.ingredient",
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
            $pull:{
                ingredients: {ingredient}
            }
        },
        {new: true}
    ).populate("ingredients.ingredient")
}

module.exports = {
    getUnsafeFoods,
    createUnsafeFood,
    updateUnsafeFood,
    deleteUnsafeFood
};