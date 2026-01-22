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
    symptoms: [
        {
            symptom: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Symptom"
            },
            severity: Number
        }
    ],
    created: { type: Date, required: true },
    edited: Date
})

module.exports = mongoose.model('Reaction', reactionSchema)