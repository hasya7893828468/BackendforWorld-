const mongoose = require("mongoose");

const vendorOrderSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Vendor" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
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

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.VendorOrder || mongoose.model("VendorOrder", vendorOrderSchema);
