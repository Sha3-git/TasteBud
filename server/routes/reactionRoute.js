const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reactionController")

router.get("/daily", reactionController.getReactionByDay);
router.post("/create", reactionController.createReaction);
router.get("/", reactionController.getReaction);
router.get("/stats", reactionController.dailyStats);
router.get("/sus", reactionController.getSuspectedFoods);
router.get("/analysis", reactionController.getMonthlyAnalysis);

module.exports = router
