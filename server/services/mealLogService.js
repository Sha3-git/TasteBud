const MealLog = require("../models/mealLogs");
const { dayRange, weekRange, monthRange, yearRange } = require("../utils/dateRange");

const createMealLog = async (userId, data) => {
  input = {
    userId: userId,
    ...data,
    created: new Date(),
  }
  const result = await MealLog.create(input);
  return result
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


async function getMealLogsInRange(userId, start, end, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const result =  await MealLog.find({
    userId,
    deleted: false,
    created: { $gte: start, $lte: end },
  })
    .populate("ingredients")
    .populate("reaction")
    .skip(skip)
    .limit(limit)
    .sort({ created: -1 });

    return result
}

async function getMealLogByDay(userId, date, page = 1, limit = 10) {
  const { start, end } = dayRange(date);
  return getMealLogsInRange(userId, start, end, page, limit);
}

async function getMealLogByWeek(userId, date, page = 1, limit = 10) {
  const { start, end } = weekRange(date);
  return getMealLogsInRange(userId, start, end, page, limit);
}

async function getMealLogByMonth(userId, year, month, page = 1, limit = 10) {
  const { start, end } = monthRange(year, month);
  return getMealLogsInRange(userId, start, end, page, limit);
}

async function getMealLogByYear(userId, year, page = 1, limit = 10) {
  const { start, end } = yearRange(year);
  return getMealLogsInRange(userId, start, end, page, limit);
}

module.exports = {
  createMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogs,
  getMealLogByDay,
  getMealLogByWeek,
  getMealLogByMonth
};