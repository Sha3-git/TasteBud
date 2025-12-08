const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reactionController")


router.get("/daily", reactionController.getReactionByDay);

module.exports = router