const puppeteer = require("puppeteer");
const User = require("../models/user");
const { getMonthlyAnalysis } = require("./reactionService");
const { getSuspectedFoods } = require("./analysisService");
const { getCrossReactions } = require("./crossReactionService");
const { generateHTML } = require("../utils/reportTemplate");


const buildFullReportData = async (userId, year, month) => {

  const [user, monthlyAnalysis, suspectedFoods] = await Promise.all([
    User.findById(userId),
    getMonthlyAnalysis(userId, year, month),
    getSuspectedFoods(userId)
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const crossReactions = (
    await Promise.all(
      suspectedFoods.map(food => getCrossReactions(food.id))
    )
  ).flat();

  return {
    user,
    monthlyAnalysis,
    suspectedFoods,
    crossReactions,
    year,
    month
  };
};


const updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};



const generateUserReportPDF = async (reportData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = generateHTML(reportData);

  await page.setContent(html, { waitUntil: "networkidle0" });

 await new Promise(resolve => setTimeout(resolve, 1000));

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return buffer;
};


module.exports = {
    buildFullReportData,
     generateUserReportPDF,
    updateUser,
};