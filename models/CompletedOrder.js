const mongoose = require("mongoose");

const completedOrderSchema = new mongoose.Schema({
    userName: String,
    cartItems: [
        {
            name: String,
            price: Number,
            quantity: Number,
            totalPrice: Number,
            img: String,
        },
    ],
    completedAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const CompletedOrder = mongoose.models.CompletedOrder || mongoose.model("CompletedOrder", completedOrderSchema);
module.exports = CompletedOrder;
