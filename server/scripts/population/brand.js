const fs = require("fs");
const csv = require("csv-parser");
require("dotenv").config();
const BrandedFood = require("../../models/brandedFoods");

const filePath = "your_path/FoodData_Central_csv_2025-12-18/branded_food.csv";

const BATCH_SIZE = 1000;
let batch = [];
let count = 0;

const FOOD_CSV_PATH =
  "your_path/FoodData_Central_csv_2025-12-18/food.csv";

const loadFoodDescriptions = () => {
  return new Promise((resolve, reject) => {
    const foodMap = new Map();

    fs.createReadStream(FOOD_CSV_PATH)
      .pipe(csv())
      .on("data", (row) => {
        if (row.fdc_id && row.description) {
          foodMap.set(row.fdc_id, row.description);
        }
      })
      .on("end", () => {
        console.log(`Loaded ${foodMap.size} food descriptions`);
        resolve(foodMap);
      })
      .on("error", reject);
  });
};

const startImport = async () => {
  BrandedFood.db.once("connected", () => console.log("BrandedFoods DB ready"));
  const foodDescriptions = await loadFoodDescriptions();

  console.log("Starting import...");

  const stream = fs.createReadStream(filePath)
    .pipe(csv()); // default separator = comma

  stream.on("data", async (row) => {
    stream.pause();

    try {
      // skip header rows
      if (!row.ingredients || row.fdc_id === "fdc_id") {
        stream.resume();
        return;
      }

      const ingredientsArray = row.ingredients
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

        const description =
        foodDescriptions.get(row.fdc_id) || row.description || "Unnamed Food";

      const food = {
        description,
        ingredients: ingredientsArray,
        brandedFoodCategory: row.branded_food_category || "Unknown",
        brandOwner: row.brand_owner || "Unknown",
      };

      batch.push(food);

      if (batch.length >= BATCH_SIZE) {
        await BrandedFood.insertMany(batch, { ordered: false });
        count += batch.length;
        console.log(`Inserted ${count} foods`);
        batch = [];
      }
    } catch (err) {
      console.error("Insert error:", err.message);
    } finally {
      stream.resume();
    }
  });

  stream.on("end", async () => {
    if (batch.length > 0) {
      await BrandedFood.insertMany(batch, { ordered: false });
      count += batch.length;
    }
    console.log(`Finished inserting ${count} foods`);
    await BrandedFood.db.close();
  });

  stream.on("error", err => {
    console.error("Stream error:", err);
  });
};

startImport();
