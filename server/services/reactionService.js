const Reaction = require("../models/reaction")
const MealLogService = require("../services/mealLogService")
const UnsafeFood = require("../models/unsafeFoods")
const { dayRange } = require("../utils/dateRange");


async function getReactionByDay(userId, date, page = 1, limit = 10) {
  const { start, end } = dayRange(date, tzOffset = 360);
  return getReactionsInRange(userId, start, end, page, limit);
}
async function getReaction(mealLogId) {
  const result = await Reaction.findOne({ mealLogId: mealLogId }).populate("symptoms.symptom")
  return result;
}

async function getReactionsInRange(userId, start, end, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const result = await Reaction.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  })
    .populate("mealLogId")
    .skip(skip)
    .limit(limit)

  console.log(result)
  return result
}

async function createReaction(userId, data) {
  const reaction = {
    userId,
    mealLogId: data.mealLogId,
    symptoms: data.symptoms,
  }
  return await Reaction.create(reaction)
}

async function dailyStats(userId, date, tzOffset) {
  const { start, end } = dayRange(date, tzOffset);
  const reacCount = await Reaction.countDocuments({
    userId,
    createdAt: { $gte: start, $lte: end },
  });

  return {
    reacCount,
  };
}

/**
 * Track ingredients that are in meals with reactions
 * Ingredients that appear ONLY in reaction meals are suspected triggers
 * Now auto-syncs suspected foods to UnsafeFoods collection
 */
const getSuspectedFoods = async (userId) => {
  const meals = await MealLogService.getMealLogs(userId);

  const reactions = await Reaction.find({ userId })
    .populate({
      path: "mealLogId",
      populate: {
        path: "ingredients",
        select: "name",
      },
    });

  const stats = {};

  meals.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const name = ingredient.name;

      if (!stats[name]) {
        stats[name] = {
          id: ingredient._id,
          totalMeals: 0,
          reactionScore: 0,
          reactionMeals: 0,
          nonReactionMeals: 0,
          totalSeverity: 0,
          severityCount: 0,
          avgSeverity: 0,
        };
      }

      stats[name].totalMeals += 1;

      if (!meal.hadReaction) {
        stats[name].nonReactionMeals += 1;
      }
    });
  });

  reactions.forEach((reaction) => {
    const ingredients = reaction.mealLogId.ingredients || [];

    const reactionTotalSeverity = reaction.symptoms.reduce((sum, symptom) => {
      return sum + (symptom.severity || 0);
    }, 0);
    const symptomCount = reaction.symptoms.length;

    ingredients.forEach((ingredient) => {
      const name = ingredient.name;
      if (stats[name]) {
        stats[name].reactionMeals += 1;
        stats[name].totalSeverity += reactionTotalSeverity;
        stats[name].severityCount += symptomCount;
        if (stats[name].severityCount > 0) {
          stats[name].avgSeverity = stats[name].totalSeverity / stats[name].severityCount;
        }
      }
    });
  });

  // Filter to only suspected foods (appear in reactions but never in non-reaction meals)
  const suspectedFoods = Object.entries(stats)
    .map(([ingredient, s]) => ({
      id: s.id,
      ingredient,
      totalMeals: s.totalMeals,
      reactionMeals: s.reactionMeals,
      reactionRate: s.reactionMeals / s.totalMeals,
      nonReactionMeals: s.nonReactionMeals,
      avgSeverity: s.avgSeverity,      
      totalSeverity: s.totalSeverity, 
      severityCount: s.severityCount, 
    }))
    .filter(
      (i) => i.reactionMeals > 0 && i.nonReactionMeals === 0
    )
    .sort((a, b) => b.reactionMeals - a.reactionMeals);

  // Auto-sync suspected foods to UnsafeFoods collection
  await syncSuspectedToUnsafeFoods(userId, suspectedFoods);

  return suspectedFoods;
};

/**
 * Sync suspected foods to the UnsafeFoods collection
 * - Adds new suspected foods
 * - Does NOT remove foods (user might have confirmed them)
 * - Does NOT overwrite preExisting or confirmed foods
 */
async function syncSuspectedToUnsafeFoods(userId, suspectedFoods) {
  try {
    // Find or create user's unsafe foods document
    let unsafeFoodsDoc = await UnsafeFood.findOne({ userId });
    
    if (!unsafeFoodsDoc) {
      unsafeFoodsDoc = await UnsafeFood.create({
        userId,
        ingredients: []
      });
    }

    // Get existing ingredient IDs
    const existingIngredientIds = unsafeFoodsDoc.ingredients.map(
      (item) => item.ingredient.toString()
    );

    // Add new suspected foods that aren't already in the list
    let hasChanges = false;
    
    for (const suspect of suspectedFoods) {
      const ingredientId = suspect.id.toString();
      
      if (!existingIngredientIds.includes(ingredientId)) {
        unsafeFoodsDoc.ingredients.push({
          ingredient: suspect.id,
          status: "suspected",
          preExisting: false,
        });
        hasChanges = true;
        console.log(`Added suspected food: ${suspect.ingredient}`);
      }
    }

    // Save if there were changes
    if (hasChanges) {
      await unsafeFoodsDoc.save();
      console.log("Synced suspected foods to UnsafeFoods collection");
    }
  } catch (err) {
    console.error("Error syncing suspected foods:", err);
    // Don't throw - this is a side effect, main function should still return results
  }
}

/**
 * Get monthly analysis data for the Symptom Analysis screen
 * Returns: monthlyImprovement, totalSymptoms, symptomFreeDays, weeklyTrend, timeOfDay
 */
const getMonthlyAnalysis = async (userId, year, month) => {
  // Calculate date ranges for current and previous month
  const currentMonthStart = new Date(year, month - 1, 1);
  const currentMonthEnd = new Date(year, month, 0, 23, 59, 59, 999);
  
  const prevMonthStart = new Date(year, month - 2, 1);
  const prevMonthEnd = new Date(year, month - 1, 0, 23, 59, 59, 999);

  // Get reactions for current month
  const currentMonthReactions = await Reaction.find({
    userId,
    createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
  }).populate("symptoms.symptom");

  // Get reactions for previous month
  const prevMonthReactions = await Reaction.find({
    userId,
    createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
  });

  // Calculate total symptoms this month
  let totalSymptoms = 0;
  currentMonthReactions.forEach((reaction) => {
    totalSymptoms += reaction.symptoms.length;
  });

  // Calculate total symptoms last month
  let prevMonthSymptoms = 0;
  prevMonthReactions.forEach((reaction) => {
    prevMonthSymptoms += reaction.symptoms.length;
  });

  // Calculate monthly improvement
  let monthlyImprovement = 0;
  if (prevMonthSymptoms > 0) {
    monthlyImprovement = Math.round(
      ((prevMonthSymptoms - totalSymptoms) / prevMonthSymptoms) * 100
    );
  }

  // Calculate symptom-free days
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysWithReactions = new Set();
  currentMonthReactions.forEach((reaction) => {
    const day = reaction.createdAt.getDate();
    daysWithReactions.add(day);
  });
  
  // Only count days up to today if current month
  const today = new Date();
  let daysToCount = daysInMonth;
  if (year === today.getFullYear() && month === today.getMonth() + 1) {
    daysToCount = today.getDate();
  }
  const symptomFreeDays = daysToCount - daysWithReactions.size;

  // Calculate weekly trend (4 weeks)
  const weeklyTrend = [];
  for (let week = 1; week <= 4; week++) {
    const weekStart = new Date(year, month - 1, (week - 1) * 7 + 1);
    const weekEnd = new Date(year, month - 1, week * 7, 23, 59, 59, 999);
    
    // Don't go past end of month
    if (weekStart > currentMonthEnd) break;
    
    const weekReactions = currentMonthReactions.filter((r) => {
      return r.createdAt >= weekStart && r.createdAt <= weekEnd;
    });

    let totalSeverity = 0;
    let severityCount = 0;
    weekReactions.forEach((reaction) => {
      reaction.symptoms.forEach((symptom) => {
        totalSeverity += symptom.severity || 0;
        severityCount++;
      });
    });

    const avgSeverity = severityCount > 0 
      ? Math.round((totalSeverity / severityCount) * 10) / 10 
      : 0;

    weeklyTrend.push({
      week: `Week ${week}`,
      avgSeverity,
      reactionCount: weekReactions.length,
    });
  }

  // Calculate time of day patterns
  const timeOfDay = {
    breakfast: 0, // 5am - 11am
    lunch: 0,     // 11am - 4pm
    dinner: 0,    // 4pm - 10pm
  };

  currentMonthReactions.forEach((reaction) => {
    const hour = reaction.createdAt.getHours();
    if (hour >= 5 && hour < 11) {
      timeOfDay.breakfast++;
    } else if (hour >= 11 && hour < 16) {
      timeOfDay.lunch++;
    } else if (hour >= 16 && hour < 22) {
      timeOfDay.dinner++;
    }
  });

  // Convert to percentages
  const totalTimeReactions = timeOfDay.breakfast + timeOfDay.lunch + timeOfDay.dinner;
  if (totalTimeReactions > 0) {
    timeOfDay.breakfast = Math.round((timeOfDay.breakfast / totalTimeReactions) * 100);
    timeOfDay.lunch = Math.round((timeOfDay.lunch / totalTimeReactions) * 100);
    timeOfDay.dinner = Math.round((timeOfDay.dinner / totalTimeReactions) * 100);
  }

  return {
    monthlyImprovement,
    totalSymptoms,
    symptomFreeDays,
    weeklyTrend,
    timeOfDay,
    // Extra data for debugging/display
    daysWithReactions: daysWithReactions.size,
    prevMonthSymptoms,
    reactionCount: currentMonthReactions.length,
  };
};

module.exports = {
  getReactionByDay,
  createReaction,
  getReaction,
  dailyStats,
  getSuspectedFoods,
  getMonthlyAnalysis
};
