const mongoose = require("mongoose")

const symptomSchema = new mongoose.Schema({
    name: { type: String, required: true},
    synonymPrimary: String,
    synonymSecondary: String,
    synonymTertiary: String,
    is_a: {type: String, required: true}
})

module.exports = mongoose.model('Symptom', symptomSchema)