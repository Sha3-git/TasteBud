const MealLog = require("../models/mealLogs");
const mongoose = require("mongoose");
const { dayRange, weekRange, monthRange, yearRange } = require("../utils/dateRange");

const createMealLog = async (userId, data) => {
  const input = {
    userId: userId,
    ...data,
  };
  const result = await MealLog.create(input);
  return result;
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

const getMealLogs = async (userId) => {
  return await MealLog.find({ userId: userId, deleted: false }).lean();
};

async function dailyStats(userId, date, tzOffset) {
  const { start, end } = dayRange(date, tzOffset);
  console.log(start + " " + end);
  const mealCount = await MealLog.countDocuments({
    userId,
    deleted: false,
    createdAt: { $gte: start, $lte: end },
  });

  return {
    mealCount,
  };
}

/**
 * Look up ingredient names from ingredient_mappings collection
 * This handles old meals that stored ObjectId references
 */
async function resolveIngredientNames(ingredients) {
  if (!ingredients || ingredients.length === 0) return [];
  
  const db = mongoose.connection.db;
  const mappingsCollection = db.collection("ingredient_mappings");
  
  const resolved = await Promise.all(
    ingredients.map(async (ing) => {
      // Already in new format with name
      if (ing && typeof ing === 'object' && ing.name && ing.ingredientId) {
        return {
          ingredientId: ing.ingredientId.toString ? ing.ingredientId.toString() : ing.ingredientId,
          name: ing.name
        };
      }
      
      // Populated format from Mongoose
      if (ing && typeof ing === 'object' && ing.name && ing._id) {
        return {
          ingredientId: ing._id.toString ? ing._id.toString() : ing._id,
          name: ing.name
        };
      }
      
      // Raw ObjectId or string - need to look up name
      let idString;
      if (typeof ing === 'string') {
        idString = ing;
      } else if (ing && ing.toString) {
        idString = ing.toString();
      } else {
        return { ingredientId: String(ing), name: "Unknown" };
      }
      
      try {
        // First try ingredient_mappings (for old mapped ingredients)
        const mapping = await mappingsCollection.findOne({ 
          matchedId: new mongoose.Types.ObjectId(idString) 
        });
        
        if (mapping && mapping.matchedName) {
          return {
            ingredientId: idString,
            name: mapping.matchedName
          };
        }
        
        // Fallback: try ingredients collection directly
        const ingredientsCollection = db.collection("ingredients");
        const ingredient = await ingredientsCollection.findOne({
          _id: new mongoose.Types.ObjectId(idString)
        });
        
        if (ingredient && ingredient.name) {
          return {
            ingredientId: idString,
            name: ingredient.name
          };
        }
        
        // Last resort: return ID as name
        return { ingredientId: idString, name: idString };
        
      } catch (err) {
        console.error("Error resolving ingredient:", idString, err.message);
        return { ingredientId: idString, name: idString };
      }
    })
  );
  
  return resolved;
}

async function getMealLogsInRange(userId, start, end, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const results = await MealLog.find({
    userId,
    deleted: false,
    createdAt: { $gte: start, $lte: end },
  })
    .populate("reaction")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  // Resolve ingredient names for all meals
  const mealsWithNames = await Promise.all(
    results.map(async (meal) => ({
      ...meal,
      ingredients: await resolveIngredientNames(meal.ingredients)
    }))
  );

  return mealsWithNames;
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
    const dayKey = getLocalDateKey(log.createdAt, tzOffset);
    
    if (!groupedByDay[dayKey]) {
      const [year, month, day] = dayKey.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      groupedByDay[dayKey] = {
        date: dayKey,
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
      id: log._id.toString(),
      mealName: log.mealName,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
      hadReaction: log.hadReaction,
      ingredients: log.ingredients,  // Now has {ingredientId, name} objects
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