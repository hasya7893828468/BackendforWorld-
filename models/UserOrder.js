const mongoose = require("mongoose");

const userOrderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ✅ Change from ObjectId to String
    vendorId: { type: String, required: true },
    userName: { type: String, required: true },
    cartItems: [
        {
            name: String,
            price: Number,
            quantity: Number,
            totalPrice: Number,
            img: String,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserOrder", userOrderSchema);
