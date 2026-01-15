const UnsafeFood = require("../models/unsafeFoods");

const getUnsafeFoods = async (userId) => {
    return await UnsafeFood.find({ userId, deleted: false })
        .populate("ingredients.ingredient")
        .limit(10);
};

const createUnsafeFood = async ({
    userId,
    data,   
}) => {
    return await UnsafeFood.findOneAndUpdate(
        {
            userId,
            "ingredients.ingredient": { $ne: data.ingredient },
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
    ).populate("ingredients.ingredient");
};

const updateUnsafeFood = async ({ id, ingredient, status, preExisting }) => {
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

const deleteUnsafeFood = async ({id, ingredient}) => {
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
