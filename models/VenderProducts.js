
  
  const mongoose = require('mongoose');

const venderProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    vendorId: String,
    category: { type: String, required: true },
    description: { type: String, required: true },
    Dprice: Number,
    Off: Number
});

module.exports = mongoose.model('VenderProduct', venderProductSchema);
