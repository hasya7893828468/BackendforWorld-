const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cart = require("../models/Cart"); // Import Cart model
const Product = require("../models/Product"); // Import Product model

// ✅ Add item to cart (CREATE or UPDATE)
router.post("/", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
            // If no cart exists, create a new one
            userCart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            // Check if product already exists in cart
            const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex !== -1) {
                // Update quantity if item exists
                userCart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item if it doesn't exist
                userCart.items.push({ productId, quantity });
            }
        }

        await userCart.save();
        res.status(201).json({ message: "Item added to cart", cart: userCart });

    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Fetch user's cart by user ID
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("📡 API received request for userId:", userId);

        let userCart = await Cart.findOne({ userId }).populate("items.productId");

        if (!userCart) {
            console.log("❌ No cart found for user:", userId);
            return res.status(200).json({ userId, items: [] }); // ✅ Return empty cart without creating a new one
        }

        console.log("✅ Cart found:", userCart);
        res.json(userCart);
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update cart item quantity
router.put("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const userCart = await Cart.findOne({ userId });
        if (!userCart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex !== -1) {
            userCart.items[itemIndex].quantity = quantity;
            await userCart.save();
            return res.json({ message: "Cart updated", cart: userCart });
        }

        res.status(404).json({ message: "Product not found in cart" });
    } catch (error) {
        console.error("❌ Error updating cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const userCart = await Cart.findOne({ userId });
        if (!userCart) return res.status(404).json({ message: "Cart not found" });

        userCart.items = userCart.items.filter(item => item.productId.toString() !== productId);

        await userCart.save();
        res.json({ message: "Item removed from cart", cart: userCart });
    } catch (error) {
        console.error("❌ Error removing item:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Clear entire cart for a user
router.delete("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const userCart = await Cart.findOne({ userId });
        if (!userCart) return res.status(404).json({ message: "Cart not found" });

        userCart.items = [];
        await userCart.save();

        res.json({ message: "Cart cleared", cart: userCart });
    } catch (error) {
        console.error("❌ Error clearing cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
