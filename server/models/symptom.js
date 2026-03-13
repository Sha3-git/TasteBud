const mongoose = require("mongoose")

const symptomSchema = new mongoose.Schema({
    name: { type: String, required: true},
    synonyms: [{ type: String }],
    description: String,
    isA: {type: String, required: true},
    reactionType: [{
    type: String,
    enum: ['allergic', 'intolerance', 'FODMAP', 'food poisoning', 'neurological', 'other']
  }]
})

module.exports = mongoose.model('Symptom', symptomSchema)