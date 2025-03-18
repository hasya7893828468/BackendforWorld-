const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    Dprice: { type: Number, required: true },
    Off: { type: String, required: true }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Card", CardSchema);
