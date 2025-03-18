const express = require("express");
const router = express.Router();
const UserOrder = require("../models/UserOrder");

// ✅ Fetch user orders (Including completed ones)
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("🔍 Fetching orders for user:", userId);

        const orders = await UserOrder.find({ userId });

        if (!orders || orders.length === 0) {
            console.log("❌ No orders found for this user.");
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

module.exports = router;
