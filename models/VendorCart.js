const mongoose = require('mongoose');
const Order = require("../models/OrderModel"); // ✅ Import the model


const OrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true }, // ✅ Store user name
  cartItems: [
    {
      name: String,
      img: String,
      price: Number,
      quantity: Number,
      totalPrice: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = Order
