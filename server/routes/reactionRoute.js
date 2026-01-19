const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reactionController")

router.get("/daily", reactionController.getReactionByDay);
router.post("/create", reactionController.createReaction)

module.exports = router