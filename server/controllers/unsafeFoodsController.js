const unsafeFoodsService = require("../services/unsafeFoodsService");

const getUnsafeFoods = async (req, res) => {
    try {
        const { userId } = req.query
        const unsafeFoods = await unsafeFoodsService.getUnsafeFoods(userId)
        if(!unsafeFoods)return res.status(404).json({ error: "Food not found" });
        res.status(201).json(unsafeFoods)
    }
        catch (err) {
        res.status(400).json({error: err.message })
    }

}
const createUnsafeFood = async (req, res) => {
    try {
        const { userId } = req.query // const userId = req.user;
        const unsafeFoods = await unsafeFoodsService.createUnsafeFood(userId, req.body)
        if (!unsafeFoods) return res.status(404).json({ error: "Food not found" });
        res.status(201).json(unsafeFoods)
    }
    catch (err) {
        res.status(400).json({error: err.message })
    }
}

const updateUnsafeFood = async (req, res) => {
    try {
        const updateUnsafeFood = await unsafeFoodsService.updateUnsafeFood(req.params.id, req.body);;
        if (!updateUnsafeFood) return res.status(404).json({ error: "Food not found" });
        res.status(200).json(updateUnsafeFood)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteUnsafeFood = async (req, res) => {
    try {
        const deleteUnsafeFood = await unsafeFoodsService.deleteUnsafeFood(req.params.id, req.body)
        if (!deleteUnsafeFood) return res.status(404).json({ error: "Food not found" });
        res.status(200).json(deleteUnsafeFood)
    } catch (err) {
        res.status(400).json({ error: err.messsage })
    }
}

module.exports = {
    getUnsafeFoods,
    createUnsafeFood,
    updateUnsafeFood,

}