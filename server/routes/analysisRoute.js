const express = require("express");
const router = express.Router();

const analysisContoller = require("../controllers/analysisController")


router.get("/suspected", analysisContoller.getSuspectedFoods);
router.get("/suspected-test", analysisContoller.getSuspectedFoodsTest);

module.exports = router
