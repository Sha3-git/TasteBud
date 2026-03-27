const express = require("express");
const router = express.Router();
const { getUserReportPDF } = require("../controllers/userController");

router.get("/report", getUserReportPDF);

module.exports = router;