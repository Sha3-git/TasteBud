const mongoose = require("mongoose");
require("dotenv").config();


const brandedFoodsConnection = mongoose.createConnection(
  process.env.MONGO_FOODS_URI);

brandedFoodsConnection.on("connected", () =>
  console.log("Foods DB connected")
);

const brandedFoodSchema = new mongoose.Schema({
  ingredients: [String],
  description: String,
  brandedFoodCategory: { type: String, required: true },
  brandOwner: { type: String, required: true }
});

brandedFoodSchema.index({
  ingredients: "text",
  brandName: "text",
  brandedFoodCategory: "text",
  brandOwner: "text",
}, {
  weights: {
    ingredients: 6,
    brandedFoodCategory: 4,
    description: 2,
    brandOwner: 1
  },
  name: "FoodTextIndex"
});

module.exports = brandedFoodsConnection.model("BrandedFood", brandedFoodSchema);
