const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    dateJoined: { type: Date, default: Date.now },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    refreshTokens: [
        {
            token: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
})

module.exports = mongoose.model("User", userSchema)