const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const MealLog = require("../models/mealLogs");
const Reaction = require("../models/reaction");
const UnsafeFood = require("../models/unsafeFoods");
const Ingredient = require("../models/ingredients");
const Symptom = require("../models/symptom");

// ============== USERS ==============
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, refreshTokens: 0 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0, refreshTokens: 0 }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const [meals, reactions, unsafeFoods] = await Promise.all([
      MealLog.find({ userId: req.params.id }).populate('ingredients').sort({ createdAt: -1 }).lean(),
      Reaction.find({ userId: req.params.id }).populate('symptoms.symptom').sort({ createdAt: -1 }).lean(),
      UnsafeFood.findOne({ userId: req.params.id }).populate('ingredients.ingredient').lean()
    ]);
    
    res.json({ user, meals, reactions, unsafeFoods: unsafeFoods?.ingredients || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user (NEW)
router.put("/users/:id", async (req, res) => {
  try {
    const { firstName, lastName, email, verified } = req.body;
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (verified !== undefined) updateData.verified = verified;
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, select: '-password -refreshTokens' }
    );
    
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      MealLog.deleteMany({ userId: req.params.id }),
      Reaction.deleteMany({ userId: req.params.id }),
      UnsafeFood.deleteMany({ userId: req.params.id })
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============== MEALS ==============
router.get("/meals", async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    const query = userId ? { userId } : {};
    const meals = await MealLog.find(query)
      .populate('ingredients')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/meals/:id", async (req, res) => {
  try {
    const meal = await MealLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/meals/:id", async (req, res) => {
  try {
    await MealLog.findByIdAndDelete(req.params.id);
    await Reaction.deleteMany({ mealLogId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============== REACTIONS ==============
router.get("/reactions", async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    const query = userId ? { userId } : {};
    const reactions = await Reaction.find(query)
      .populate('symptoms.symptom')
      .populate('mealLogId')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    res.json(reactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/reactions/:id", async (req, res) => {
  try {
    const reaction = await Reaction.findByIdAndDelete(req.params.id);
    if (reaction) {
      await MealLog.findByIdAndUpdate(reaction.mealLogId, { hadReaction: false });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============== TESTING SCENARIOS ==============
router.post("/test/create-scenario", async (req, res) => {
  try {
    const { userId, scenario } = req.body;
    
    const results = { mealsCreated: [], reactionsCreated: [] };
    
    for (const mealData of scenario.meals) {
      const meal = await MealLog.create({
        userId,
        ingredients: mealData.ingredients,
        mealName: mealData.mealName,
        hadReaction: mealData.hadReaction,
        createdAt: mealData.date ? new Date(mealData.date) : new Date()
      });
      results.mealsCreated.push(meal);
      
      if (mealData.hadReaction && mealData.reaction) {
        const reaction = await Reaction.create({
          userId,
          mealLogId: meal._id,
          symptoms: mealData.reaction.symptoms.map(s => ({
            symptom: s.symptomId,
            severity: s.severity || mealData.reaction.severity || 5
          })),
          createdAt: mealData.date ? new Date(mealData.date) : new Date()
        });
        results.reactionsCreated.push(reaction);
      }
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/test/clear-user-data", async (req, res) => {
  try {
    const { userId } = req.body;
    await Promise.all([
      MealLog.deleteMany({ userId }),
      Reaction.deleteMany({ userId }),
      UnsafeFood.deleteMany({ userId })
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============== STATS ==============
router.get("/stats", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get basic stats
    const [userCount, mealCount, reactionCount, ingredientCount] = await Promise.all([
      User.countDocuments(),
      MealLog.countDocuments(),
      Reaction.countDocuments(),
      Ingredient.countDocuments()
    ]);
    
    // Get AI mapping stats (if collection exists)
    let aiMappingCount = 0;
    let avgSimilarity = 0;
    try {
      const mappingsCol = db.collection("ingredient_mappings");
      aiMappingCount = await mappingsCol.countDocuments();
      
      if (aiMappingCount > 0) {
        const aggResult = await mappingsCol.aggregate([
          { $group: { _id: null, avg: { $avg: "$similarity" } } }
        ]).toArray();
        avgSimilarity = aggResult[0]?.avg || 0;
      }
    } catch (e) {
      // Collection might not exist yet
    }
    
    res.json({ 
      userCount, 
      mealCount, 
      reactionCount, 
      ingredientCount,
      aiMappingCount,
      avgSimilarity: Math.round(avgSimilarity * 100) / 100
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============== AI MAPPING STATS (NEW) ==============
router.get("/ai-mappings", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const mappingsCol = db.collection("ingredient_mappings");
    
    const totalMappings = await mappingsCol.countDocuments();
    
    if (totalMappings === 0) {
      return res.json({ 
        totalMappings: 0, 
        message: "No AI mappings found. Run the ML matching script first." 
      });
    }
    
    // Get stats
    const aggResult = await mappingsCol.aggregate([
      { $group: { 
        _id: null, 
        avgSimilarity: { $avg: "$similarity" },
        minSimilarity: { $min: "$similarity" },
        maxSimilarity: { $max: "$similarity" }
      }}
    ]).toArray();
    
    // Get top matches (perfect or near-perfect)
    const topMatches = await mappingsCol.find({ similarity: { $gte: 0.95 } })
      .limit(10)
      .toArray();
    
    // Get low confidence matches
    const lowMatches = await mappingsCol.find({ similarity: { $lt: 0.5 } })
      .sort({ similarity: 1 })
      .limit(10)
      .toArray();
    
    // Get distribution by similarity ranges
    const distribution = await mappingsCol.aggregate([
      { $bucket: {
        groupBy: "$similarity",
        boundaries: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.01],
        default: "other",
        output: { count: { $sum: 1 } }
      }}
    ]).toArray();
    
    res.json({
      totalMappings,
      stats: aggResult[0] || {},
      topMatches,
      lowMatches,
      distribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search AI mappings
router.get("/ai-mappings/search", async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.json([]);
    
    const db = mongoose.connection.db;
    const mappingsCol = db.collection("ingredient_mappings");
    
    const results = await mappingsCol.find({
      $or: [
        { original: { $regex: q, $options: 'i' } },
        { matchedName: { $regex: q, $options: 'i' } }
      ]
    })
    .limit(parseInt(limit))
    .toArray();
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;