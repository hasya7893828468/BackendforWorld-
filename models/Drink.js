const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  Dprice: { type: Number }, // Discounted price
  Off: { type: String }, // Discount percentage
  rating: { type: Number, default: 0 },
  img: { type: String, required: true },
});

module.exports = mongoose.model('Drink', drinkSchema);
