const mongoose = require("mongoose")

const crossReactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scientificName: String,
    proteinSequence: String,
    similarities: [{
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient",
            required: true
        },
        name: String,
        score: Number,
         _id: false
    }],
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
    },

})

module.exports = mongoose.model("Crossreaction", crossReactionSchema)