const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const Ingredient = require("../../models/ingredients");
console.log("uri: " + process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });


const finalFoods = JSON.parse(
    fs.readFileSync("your_path/final_foods.json", "utf8")
);

async function importFoods() {
    try {
        for (const food of finalFoods) {

            if (!food.allergens || food.allergens.length === 0) {
            }

            const doc = {
                name: food.name,
                scientificName: food.scientific_name,
                foodGroup: food.group || "Unknown",
                foodSubgroup: food.subgroup || null,


                allergens: (food.allergens || []).map(a =>
                    a.iuis_name || a.allergen_id.toString()
                ),

                intoleranceType: []
            };

            await Ingredient.findOneAndUpdate(
                { name: doc.name },
                doc,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log("complete!");
    } catch (err) {
        console.error("failed:", err);
    } finally {
        mongoose.connection.close();
    }
}

importFoods();
