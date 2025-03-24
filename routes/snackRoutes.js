const express = require("express");
const router = express.Router();
const Snack = require("../models/Snack");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// ✅ Multer Storage (Memory for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Get all snacks
router.get("/", async (req, res) => {
  try {
    const snacks = await Snack.find();
    if (!snacks.length) return res.status(404).json({ message: "No snacks found" });
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching snacks" });
  }
});

// ✅ Get snack by name
router.get("/name/:name", async (req, res) => {
  try {
    const snackName = decodeURIComponent(req.params.name).trim();
    const snack = await Snack.findOne({ name: new RegExp(`^${snackName}$`, "i") });
    if (!snack) return res.status(404).json({ message: "Snack not found" });
    res.json(snack);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new snack (Cloudinary Upload)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Name and Price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { name, price, Dprice, Off } = req.body;

    // Upload image to Cloudinary
    const stream = cloudinary.uploader.upload_stream(async (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }

      const newSnack = new Snack({
        name,
        img: result.secure_url, // Store Cloudinary URL
        price,
        Dprice,
        Off,
      });

      await newSnack.save();
      res.status(201).json({ message: "✅ Snack added", snack: newSnack });
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("❌ Error adding snack:", err);
    res.status(500).json({ error: "Error adding snack" });
  }
});

// ✅ Delete a snack (Remove from Cloudinary)
router.delete("/:id", async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) return res.status(404).json({ error: "Snack not found" });

    // Extract Cloudinary public ID from URL
    const publicId = snack.img.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from database
    await Snack.findByIdAndDelete(req.params.id);

    res.json({ message: "✅ Snack deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting snack:", err);
    res.status(500).json({ error: "Error deleting snack" });
  }
});

// ✅ Get snack by ID
router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Snack ID format" });
    }

    const snack = await Snack.findById(req.params.id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });

    res.json(snack);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router; // ✅ Export the router correctly
