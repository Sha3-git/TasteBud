const mongoose = require("mongoose");


const brandedFoodSchema = new mongoose.Schema({
  ingredients: [String],
  description: String,
  brandedFoodCategory: { type: String, required: true },
  brandOwner: { type: String, required: true }
});

brandedFoodSchema.index({
  description: "text",
  brandedFoodCategory: "text",
  brandOwner: "text",
}, {
  weights: {
    brandedFoodCategory: 4,
    description: 2,
    brandOwner: 1
  },
  name: "FoodTextIndex"
});

module.exports = mongoose.model("BrandedFood", brandedFoodSchema);
