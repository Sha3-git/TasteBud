const mongoose = require (mongoose)

const crossReactionSchema = new mongoose.schema({
    crossRecGroup: [{
        type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient"
    }]
})

module.exports = mongoose.model("Crossreactions", crossReactionSchema)