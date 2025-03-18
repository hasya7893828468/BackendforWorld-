const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CompletedOrder = require("../models/CompletedOrder");
const Order = require("../models/Order");

router.post("/complete-order", async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log("🛠️ Received Order ID:", orderId);

        if (!orderId) {
            console.log("❌ Order ID is missing!");
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            console.log("❌ Order Not Found in Orders Collection!");
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("✅ Order Found:", order);

        const completedOrder = new CompletedOrder({
            _id: order._id,
            userName: order.userName,
            cartItems: order.cartItems,
            completedAt: new Date(),
        });

        await completedOrder.save();
        await Order.findByIdAndDelete(orderId);

        console.log("🎯 Order Moved to Completed Orders Successfully");

        res.status(200).json({ message: "Order moved to completed orders" });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/completed-orders", async (req, res) => {
    try {
        console.log("📥 Fetching Completed Orders...");
        const completedOrders = await CompletedOrder.find();
        console.log("📥 Completed Orders Data:", completedOrders);
        res.status(200).json(completedOrders);
    } catch (error) {
        console.error("❌ Error fetching completed orders:", error);
        res.status(500).json({ message: "Error fetching completed orders", error });
    }
});

module.exports = router;
