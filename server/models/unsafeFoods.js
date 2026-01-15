const mongoose = require("mongoose")

const unsafeFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ingredients: [
    {
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
      status: {
        type: String,
        enum: ["suspected", "confirmed"],
        required: true,
      },
      preExisting: {
        type: Boolean,
        required: true,
      },
    },
  ],
})

const UnsafeFood = mongoose.model("UnsafeFood", unsafeFoodSchema)

module.exports = UnsafeFood
