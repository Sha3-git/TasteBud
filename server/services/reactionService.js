const Reaction = require("../models/reaction")
const { dayRange, weekRange, monthRange, yearRange } = require("../utils/dateRange");


async function getReactionByDay(userId, date, page = 1, limit = 10) {
  const { start, end } = dayRange(date, tzOffset=360);
  return getReactionsInRange(userId, start, end, page, limit);
}
async function getReaction(mealLogId) {
  const result = await Reaction.find({mealLogId: mealLogId})
  return result;
}

async function getReactionsInRange(userId, start, end, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const result =  await Reaction.find({
    userId,
    //deleted: false,
    created: { $gte: start, $lte: end },
  })
    .populate("mealLogId")
    .skip(skip)
    .limit(limit)
    .sort({ created: -1 });

    console.log(result)
    return result
}

async function createReaction(userId, data) {
  const reaction = {
    userId,
    mealLogId: data.mealLogId,
    symptoms: data.symptoms,
    created: new Date(),
  }
  return await Reaction.create(reaction)
}
/**
 * when a user creates a meal log an associated reaction is made for said meal log 
 * the user can search symptoms and the ids are sent as an array of symptom ids
 * then
 */

async function updateReaction(id, data) {
  const updateData = { edited: new Date() };
  
  if (data.symptoms !== undefined) {
    updateData.symptoms = data.symptoms;
  }
  
  return await Reaction.findByIdAndUpdate(id, updateData, { new: true })
    .populate("mealLogId");
}

async function deleteReaction(id) {
  return await Reaction.findByIdAndDelete(id);
}



module.exports = {
  getReactionByDay,
  createReaction,
  getReaction,
  updateReaction,
  deleteReaction
};
