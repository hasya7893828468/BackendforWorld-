const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Route to place an order
router.post("/add-order", async (req, res) => {
  try {
    const { vendorId, userId, userName, userLocation, cartItems, phone, address } = req.body;

    // Validate the input fields
    if (!vendorId || !userId || !userName || !cartItems || cartItems.length === 0 || !phone || !address) {
      console.error("🚨 Invalid order data received:", req.body);
      return res.status(400).json({ msg: "Missing required fields: userName, phone, or address" });
    }

    console.log("📝 New Order Received:", req.body);

    // Create a new order with the received details
    const newOrder = new Order({
      vendorId,
      userId,
      userName,
      userLocation,
      cartItems,
      phone,
      address,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json({ msg: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Order Processing Error:", error);
    res.status(500).json({ msg: "Server error while processing order" });
  }
});


// ✅ Route for vendors to get all orders
router.get("/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ vendorId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ msg: "No orders found for this vendor." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching vendor orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to mark an order as completed
router.put("/complete-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // ✅ Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ✅ Update order status
    order.status = "Completed";
    await order.save();

    res.status(200).json({ msg: "Order marked as completed!", order });
  } catch (error) {
    console.error("❌ Error completing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
