const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  category: { type: String, required: true, enum: ["grocery", "drink", "snack"] }, // ✅ Add category
});

module.exports = mongoose.model("Product", ProductSchema);
