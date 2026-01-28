const unsafeFoodsService = require("../services/unsafeFoodsService");

const getUnsafeFoods = async (req, res) => {
    try {
        const { userId } = req.query
        const unsafeFoods = await unsafeFoodsService.getUnsafeFoods(userId)
        if(!unsafeFoods)return res.status(404).json({ error: "Food not found" });
        res.status(200).json(unsafeFoods)
    }
        catch (err) {
        res.status(400).json({error: err.message })
    }

}
const createUnsafeFood = async (req, res) => {
    try {
        const { userId } = req.query
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
        const updatedUnsafeFood = await unsafeFoodsService.updateUnsafeFood(req.params.id, req.body);
        if (!updatedUnsafeFood) return res.status(404).json({ error: "Food not found" });
        res.status(200).json(updatedUnsafeFood)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteUnsafeFood = async (req, res) => {
    try {
        const deletedUnsafeFood = await unsafeFoodsService.deleteUnsafeFood(req.params.id, req.body);
        if (!deletedUnsafeFood) return res.status(404).json({ error: "Food not found" });
        res.status(200).json(deletedUnsafeFood)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getUnsafeFoods,
    createUnsafeFood,
    updateUnsafeFood,
    deleteUnsafeFood
}