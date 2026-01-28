const Reaction = require("../models/reaction")
const MealLogService = require("../services/mealLogService")
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
    //deleted: false,
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

//track ingredients that are in meals with reactions and if they are also in meals that arent in a reaction
/**
 * track ingredients that are in meals with reactions and if they are also in meals that arent in a reaction
 * ingredients that appear solely in reaction meal logs are suspected
 * those that appear in both reactions and normal meal logs are held off on
 * the sophisitication of this algorithm can be updated based on need
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

  return Object.entries(stats)
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
};



module.exports = {
  getReactionByDay,
  createReaction,
  getReaction,
  dailyStats,
  getSuspectedFoods
};
