const mongoose = require("mongoose");

const mealLogSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
    },
    name: {
        type: String, 
        required: true
    },
    ingredients: [{ 
        type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient"
    }],
    hadReaction: {
        type: Boolean,
        required: true
    },
    /*photoUrl: {
        type: String
    },*/
    deleted: Bool
},
 { timestamps: true }
)

module.exports = mongoose.model("Meallog", mealLogSchema)