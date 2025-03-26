const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

const router = express.Router(); // ✅ Define `router`

// ✅ Vendor Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("🔍 Checking if Vendor Exists:", email);

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ error: "Vendor already exists" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ name, email, password: hashedPassword });
    await vendor.save();

    console.log("✅ Vendor Registered:", email);
    res.status(201).json({ message: "Vendor registered successfully!" });
  } catch (error) {
    console.error("❌ Vendor Registration Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Vendor Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("🔍 Searching for Vendor:", email);
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, "your_secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token, vendorId: vendor._id });
  } catch (error) {
    console.error("❌ Vendor Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Fetch Vendor Location
router.get("/vendor-location/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    

    res.json({ latitude: vendor.location.latitude, longitude: vendor.location.longitude });
  } catch (error) {
    console.error("❌ Error fetching vendor location:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Vendor Location
router.post("/update-location", async (req, res) => {
  try {
    const { vendorId, latitude, longitude } = req.body;

    if (!vendorId || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing vendorId, latitude, or longitude" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    

    vendor.location = { latitude, longitude };
    await vendor.save();

    res.json({ message: "Vendor location updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating vendor location:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/list", async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.json(vendors);
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router; // ✅ Keep only one `module.exports`
