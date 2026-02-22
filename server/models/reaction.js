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
            severity: Number,
            // NEW: When did symptoms start AFTER eating the meal?
            // Stored as minutes after the meal
            onsetMinutes: {
                type: Number,
                default: 0
            },
            // Optional: Actual timestamp when user reported feeling symptoms
            reportedAt: {
                type: Date
            }
        }
    ],
    
}, { timestamps: true })
module.exports = mongoose.model('Reaction', reactionSchema)