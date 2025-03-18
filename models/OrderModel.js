const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

// ✅ Prevent Overwriting Model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;

// 