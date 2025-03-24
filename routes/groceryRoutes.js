const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Grocery = require("../models/Grocery");

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Get all groceries
router.get("/", async (req, res) => {
  try {
    const groceries = await Grocery.find();
    res.json(groceries);
  } catch (err) {
    res.status(500).json({ error: "Error fetching groceries" });
  }
});

// ✅ Get grocery by name
router.get("/name/:name", async (req, res) => {
  try {
    let groceryName = decodeURIComponent(req.params.name);
    const grocery = await Grocery.findOne({ name: { $regex: `^${groceryName}$`, $options: "i" } });
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });
    res.json(grocery);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get grocery by ID
router.get("/:id", async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });
    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// ✅ Add a new grocery item (with image upload)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    
    const imgPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // ✅ Full URL
    
    const newGrocery = new Grocery({ name, img: imgPath, price, Dprice, Off });
    await newGrocery.save();
    res.status(201).json({ message: "Grocery added successfully", grocery: newGrocery });
  } catch (err) {
    res.status(500).json({ error: "Error adding grocery" });
  }
});

// ✅ Delete a grocery item
router.delete("/:id", async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) return res.status(404).json({ error: "Grocery not found" });

    // ✅ Delete image safely
    const filePath = path.join(__dirname, "../uploads", path.basename(grocery.img));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: "Grocery deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting grocery" });
  }
});

module.exports = router;
