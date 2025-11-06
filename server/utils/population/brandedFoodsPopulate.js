const mongoose = require("mongoose");
const BrandedFood = require("../../models/brandedFoods");
require("dotenv").config({ path: "../../.env" });

const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { pick } = require("stream-json/filters/Pick");
const fs = require("fs");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const fileStream = fs.createReadStream(
    "D:/Downloads/FoodData_Central_branded_food_json_2025-04-24/FoodData_Central_branded_food_json_2025-04-24.json"
);

const pipeline = chain([
    fileStream,
    parser(),
    pick({ filter: "BrandedFoods" }),
    streamArray()
]);

pipeline.on("data", async ({ value }) => {
    if (!value.ingredients) return;

    const ingredientsArray = value.ingredients
        .split(",")
        .map(i => i.trim())
        .filter(i => i);

    const food = new BrandedFood({
        description: value.description || "Unnamed Food",
        ingredients: ingredientsArray,
        brandedFoodCategory: value.brandedFoodCategory || "Unknown",
        brandName: value.brandName || "Unknown",
        brandOwner: value.brandOwner || "Unknown",
    });

    await food.save();
    console.log(`Saved: ${food}`);
});

pipeline.on("end", () => {
    console.log("All data inserted!");
    mongoose.connection.close();
});
