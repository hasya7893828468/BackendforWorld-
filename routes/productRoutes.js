const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ✅ AI-Based Recommendations (Collaborative Filtering)
router.get("/recommendations", async (req, res) => {
  try {
    const { category, excludeId } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Find similar products in the same category
    const recommendations = await Product.find({
      category,
      _id: { $ne: excludeId }, // Exclude current product
    }).limit(5); // Get top 5 recommendations

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
});

module.exports = router;
