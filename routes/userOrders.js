const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserOrder = require("../models/UserOrder");

router.get("/:userId", async (req, res) => {
    try {
        let { userId } = req.params;
        console.log("🔍 Fetching orders for userId:", userId);

        // ✅ Convert to ObjectId if needed
        if (mongoose.Types.ObjectId.isValid(userId)) {
            userId = new mongoose.Types.ObjectId(userId);
        }

        const orders = await UserOrder.find({ userId }).exec();

        if (!orders.length) {
            console.log("❌ No orders found.");
            return res.status(404).json({ error: "No orders found for this user." });
        }

        console.log("✅ Orders Found:", orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
