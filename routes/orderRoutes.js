const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order"); // ✅ Ensure correct import


// ✅ Add Order Route (Improved Validation & Logging)
router.post("/add-order", async (req, res) => {
  try {
    console.log("🛠️ Incoming Order Data:", JSON.stringify(req.body, null, 2));

    const { userId, userName, vendorId, name, phone, address, userLocation, cartItems, grandTotal } = req.body;

    // ✅ Log each field to ensure it's correctly received
    console.log("🔍 Checking required fields:", { userId, userName, vendorId, name, phone, address, grandTotal, cartItems, userLocation });

    // ✅ Validate required fields
    if (!userId || !userName || !vendorId || !name || !phone || !address || !grandTotal) {
      console.error("❌ Missing required fields:", { userId, userName, vendorId, name, phone, address, grandTotal });
      return res.status(400).json({ msg: "❌ Missing required order details!" });
    }

    // ✅ Ensure `cartItems` is a valid array and not empty
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("❌ Invalid cart items:", cartItems);
      return res.status(400).json({ msg: "❌ Cart must contain at least one item!" });
    }

    // ✅ Ensure `userLocation` is properly structured
    if (!userLocation || typeof userLocation.latitude !== "number" || typeof userLocation.longitude !== "number") {
      console.error("❌ Invalid user location:", userLocation);
      return res.status(400).json({ msg: "❌ Invalid user location format!" });
    }

    // ✅ Ensure `address` has a reasonable length
    if (address.length < 3) {
      console.error("❌ Address too short:", address);
      return res.status(400).json({ msg: "❌ Address is too short!" });
    }

    // ✅ Create and save the order
    const newOrder = new Order({
      userId,
      userName,
      vendorId,
      name,
      phone,
      address,
      userLocation,
      cartItems,
      grandTotal,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    console.log("✅ Order saved successfully with ID:", newOrder._id);
    res.status(201).json({ message: "✅ Order placed successfully", orderId: newOrder._id });

  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ msg: "❌ Server error! Unable to place order." });
  }
});


// ✅ Get Vendor Orders
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log(`🟢 Fetching orders for vendor: ${vendorId}`);

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ error: "❌ Invalid vendor ID format" });
    }

    const orders = await Order.find({ vendorId }).sort({ createdAt: -1 });

    if (!orders.length) {
      console.warn("⚠️ No orders found for vendor:", vendorId);
      return res.status(404).json({ error: "⚠️ No orders found for this vendor" });
    }

    console.log("✅ Orders fetched:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Server error fetching vendor orders:", error);
    res.status(500).json({ message: "❌ Error fetching vendor orders", error: error.message });
  }
});


// ✅ Get User Orders
router.get("/user/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    console.log("🔍 Fetching orders for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "❌ Invalid user ID format" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ error: "⚠️ No orders found for this user" });
    }

    console.log("✅ Orders fetched:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "❌ Error fetching user orders" });
  }
});


// ✅ Mark Order as Completed
router.put("/complete-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("🔄 Marking order as completed:", orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "❌ Invalid order ID format" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "⚠️ Order not found" });
    }

    order.status = "Completed";
    await order.save();

    console.log("✅ Order marked as completed:", orderId);
    res.status(200).json({ message: "✅ Order marked as completed", order });
  } catch (error) {
    console.error("❌ Error completing order:", error);
    res.status(500).json({ message: "❌ Error completing order" });
  }
});

module.exports = router;
