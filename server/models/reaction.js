const mongoose = require("mongoose")

const reactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mealLogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meallog"
    },
    symptoms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Symptom"
    }],
    created: { type: Date, required: true },
    edited: Date
})
//find symptom based on search output id example find all reactions with itching
//find all meal logs associated with itching
//count frequency of each ingredient
module.exports = mongoose.model('Reaction', reactionSchema)