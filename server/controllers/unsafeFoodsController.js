const unsafeFoodsService = require("../services/mealLogService");

const createUnsafeFood = async (req, res) =>{
    try{
        const {userId} = req.query // const userId = req.user;
        const unsafeFoods = await unsafeFoodsService.createUnsafeFood(userId, req.body)
        res.status(201)
    }
    catch(err){
        res.status(400).json ({})
    }
}

const updateUnsafeFood = async (req, res) =>{
    try{
        const updateUnsafeFood = await unsafeFoodsService.updateUnsafeFood(req.params.id, req.body);;
        if(!updateUnsafeFood)return res.status(404).json({ error: "Food not found" });
    }catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    createUnsafeFood,
    updateUnsafeFood
}