const mongoose = require("mongoose")

const crossReactionSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient"
    },
    crossRecGroup: [{
        type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient"
    }]
})

module.exports = mongoose.model("Crossreaction", crossReactionSchema)