const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Snack = require("../models/Snack");

// ✅ Ensure 'uploads' folder exists
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Get all snacks
router.get("/", async (req, res) => {
  try {
    const snacks = await Snack.find();
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching snacks" });
  }
});

// ✅ Get snack by name
router.get("/name/:name", async (req, res) => {
  try {
    const snackName = decodeURIComponent(req.params.name).trim();
    const snack = await Snack.findOne({ name: { $regex: new RegExp(`^${snackName}$`, "i") } });
    if (!snack) return res.status(404).json({ message: "Snack not found" });
    res.json(snack);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new snack (FIXED)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    console.log("📥 Request received:", req.body);
    console.log("🖼️ Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { name, price, Dprice, Off } = req.body;
    const imgPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // ✅ Full URL

    const newSnack = new Snack({ name, img: imgPath, price, Dprice, Off });
    await newSnack.save();

    res.status(201).json({ message: "✅ Snack added", snack: newSnack });
  } catch (err) {
    console.error("❌ Error adding snack:", err);
    res.status(500).json({ error: "Error adding snack" });
  }
});

// ✅ Delete a snack (FIXED)
router.delete("/:id", async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) return res.status(404).json({ error: "Snack not found" });

    // ✅ Convert image URL to absolute file path
    const filePath = path.join(__dirname, "../uploads", path.basename(snack.img));

    // ✅ Check if file exists before deleting
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Deleted file:", filePath);
    } else {
      console.warn("⚠️ File not found:", filePath);
    }

    // ✅ Delete snack from database
    await Snack.findByIdAndDelete(req.params.id);

    res.json({ message: "✅ Snack deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting snack:", err);
    res.status(500).json({ error: "Error deleting snack" });
  }
});

// ✅ Get a single snack by ID
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

module.exports = router;
