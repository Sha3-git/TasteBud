const MealLog = require("../models/mealLog");

const createMealLog = async (meal) => {
  return await MealLog.create(meal);
};

const updateMealLog = async (id, updateData) => {
  return await MealLog.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteMealLog = async (id) => {
  return await MealLog.findByIdAndUpdate(
    id,
    { deleted: true },
    { new: true }
  );
};

//implement daily weekly monthly yearly and pagination
const getMealLogs = async (userId) => {
  return await MealLog.find({ userId: userId, deleted: false })
    .populate("ingredients").limit(10);
};

module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs
};