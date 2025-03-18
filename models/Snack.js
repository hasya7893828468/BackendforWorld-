const mongoose = require('mongoose');

const snackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  Dprice: { type: Number },
  Off: { type: String },
  rating: { type: Number, default: 0 },
  img: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Snack', snackSchema);
