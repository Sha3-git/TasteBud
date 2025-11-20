const mongoose = require("mongoose");

const ingredientsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        index: true
    },
    aliases: [{ type: String, index: true }], 
    scientificName:{
        type: String,
        required: true,
        index: true
    },
    foodGroup: {
        type: String,
        required: true,
    },
    foodSubgroup: {
        type: String,
        trim: true,
    },
    allergens: [{
        type: String,
        index: true
    }],
 
    intoleranceType: [{
        type: String,
        enum: [
            "FODMAP",
            "Sulfate",
            "Alcohol",
            "Histamine",
            "Lactose",
            "Salicylates",
            "Gluten",
            "Unspecified"
        ]
    }]
});
ingredientsSchema.index({ name: "text", scientificName: "text" });
module.exports = mongoose.model("Ingredient", ingredientsSchema);
