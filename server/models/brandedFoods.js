const mongoose = require("mongoose");
require("dotenv").config();

const brandedFoodsConnection = mongoose.createConnection(
  process.env.MONGO_FOODS_URI,
  {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    authSource: "TasteBud"
  }
);

brandedFoodsConnection.on("connected", () =>
  console.log("Foods DB connected")
);

brandedFoodsConnection.on("error", (err) =>
  console.error("Foods DB connection error:", err.message)
);

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

module.exports = brandedFoodsConnection.model("BrandedFood", brandedFoodSchema);
