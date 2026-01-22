const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reactionController")

router.get("/daily", reactionController.getReactionByDay);
router.get("/", reactionController.getReaction);
router.post("/create", reactionController.createReaction);

router.put("/update/:id", reactionController.updateReaction);
router.delete("/delete/:id", reactionController.deleteReaction);

module.exports = router