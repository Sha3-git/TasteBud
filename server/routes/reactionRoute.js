const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reactionController")

router.get("/daily", reactionController.getReactionByDay);
router.post("/create", reactionController.createReaction);
router.get("/", reactionController.getReaction);

module.exports = router