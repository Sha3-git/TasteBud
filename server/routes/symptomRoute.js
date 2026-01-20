const express = require("express");
const router = express.Router();

const symptomController = require("../controllers/symptomController")

router.get("/search", symptomController.searchSymptoms);

module.exports = router