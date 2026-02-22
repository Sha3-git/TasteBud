const mongoose = require("mongoose");

const mealLogSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mealName: {
        type: String, 
        required: true
    },
    ingredients: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
    }],
    reaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reaction"
    },
    hadReaction: {
        type: Boolean,
        required: true
    },
    deleted: {type: Boolean, default: false},
    edited: Date,
},
 { timestamps: true }
)

module.exports = mongoose.model("Meallog", mealLogSchema)