const express = require("express");
const mongoose = require("mongoose");
const SingleItem = require("../models/SingleItem"); // ✅ Ensure this model exists

const router = express.Router();

// ✅ Get all items
router.get("/", async (req, res) => {
  try {
    const items = await SingleItem.find();
    res.json(items);
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a specific item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId format:", id);
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const item = await SingleItem.findById(id);
    if (!item) {
      console.error("❌ Item not found for ID:", id);
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("❌ Server Error fetching item by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add a new item
router.post("/", async (req, res) => {
  try {
    const newItem = new SingleItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({ error: "Error adding item" });
  }
});

// ✅ Update an item by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId format:", id);
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const updatedItem = await SingleItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      console.error("❌ Item not found for update:", id);
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete an item by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId format:", id);
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const deletedItem = await SingleItem.findByIdAndDelete(id);
    if (!deletedItem) {
      console.error("❌ Item not found for deletion:", id);
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
