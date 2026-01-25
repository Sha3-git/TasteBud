const MealLog = require("../models/mealLogs");
const { dayRange, weekRange, monthRange, yearRange } = require("../utils/dateRange");

const createMealLog = async (userId, data) => {
  const input = {
    userId: userId,
    ...data, //make this more safe later
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
    .populate("ingredients", "name");
};

async function dailyStats(userId, date, tzOffset) {
  const { start, end } = dayRange(date, tzOffset);
  console.log( start + " " + end)
  const mealCount = await MealLog.countDocuments({
    userId,
    deleted: false,
    createdAt: { $gte: start, $lte: end },
  });

  return {
    mealCount,
  };
}

async function getMealLogsInRange(userId, start, end, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const result =  await MealLog.find({
    userId,
    deleted: false,
    createdAt: { $gte: start, $lte: end },
  })
    .populate("ingredients")
    .populate("reaction")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    return result
}

async function getMealLogByDay(userId, date, page = 1, limit, tzOffset) {
  const { start, end } = dayRange(date, tzOffset);
  return getMealLogsInRange(userId, start, end, page, limit);
}

async function getMealLogByWeek(userId, date, page = 1, limit = 10) {
  const { start, end } = weekRange(date);
  return getMealLogsInRange(userId, start, end, page, limit);
}


async function getMealLogByMonth(userId, year, month, page = 1, limit, tzOffset) {
  const { start, end } = monthRange(year, month, tzOffset);

  const mealLogs = await getMealLogsInRange(userId, start, end, page, limit);
  function getLocalDateKey(utcDate, tzOffsetMinutes) {
    const date = new Date(utcDate);
    const localTime = new Date(date.getTime() - tzOffsetMinutes * 60000);
    
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const groupedByDay = {};
  
  mealLogs.forEach(log => {
    if (!Array.isArray(log.ingredients)) {
      log.ingredients = [];
    }
    
    const dayKey = getLocalDateKey(log.createdAt, tzOffset);
    
    if (!groupedByDay[dayKey]) {
      const [year, month, day] = dayKey.split('-').map(Number);
      
      const localDate = new Date(year, month - 1, day);
      
      
      groupedByDay[dayKey] = {
        date: dayKey, //YYYY-MM-DD 
        dayName: localDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          timeZone: 'UTC'
        }).toUpperCase(),
        dayNumber: day, 
        meals: [],
        isExpanded: true,
      };
    }
    
    groupedByDay[dayKey].meals.push({
      id: log._id,
      mealName: log.mealName,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
      hadReaction: log.hadReaction,
      ingredients: log.ingredients,
      reaction: log.reaction,
    });
  });
  
  const monthLogs = Object.values(groupedByDay).sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return monthLogs;
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
  getMealLogByMonth,
  dailyStats
};