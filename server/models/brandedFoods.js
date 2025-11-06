const mongoose = require("mongoose");

const brandedFoodSchema = new mongoose.Schema({
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  brandedFoodCategory: { type: String, required: true },
  brandName: { type: String, required: true },
  brandOwner: { type: String, required: true }
});

brandedFoodSchema.index({
  description: "text",
  ingredients: "text",
  brandName: "text",
  brandOwner: "text",
}, {
  weights: {
    description: 5,
    ingredients: 6,
    brandName: 1,
    brandOwner: 1
  },
  name: "FoodTextIndex"
});

module.exports = mongoose.model("BrandedFood", brandedFoodSchema);
