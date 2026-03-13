const express = require("express");
const router = express.Router();

const analysisContoller = require("../controllers/analysisController")


router.get("/suspected", analysisContoller.getSuspectedFoods);

module.exports = router
