const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Grocery = require("../models/Grocery");

// ✅ Multer storage setup
const storage = multer.diskStorage({
  // destination: "uploads/",
    destination: "tiger/",

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
    console.log("Received ID:", req.params.id); // Debugging

    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      console.log("Grocery not found!"); // Debugging
      return res.status(404).json({ message: "Grocery not found" });
    }
    res.json(grocery);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// ✅ Add a new grocery item
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const imgPath = `/tiger/${req.file.filename}`;
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

    // Delete image from server
    const filePath = path.join(__dirname, "../", grocery.img); // Join with the directory
    fs.unlinkSync(filePath);
    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: "Grocery deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting grocery" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Grocery = require("../models/Grocery");

// Use Multer to store files in memory
const storage = multer.memoryStorage();
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

// ✅ Add a new grocery (Upload to Cloudinary)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image file is required" });

    // Upload image to Cloudinary
    let imageUrl = "";
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }
      imageUrl = result.secure_url;

      // Save grocery with Cloudinary URL
      const newGrocery = new Grocery({
        name,
        img: imageUrl,
        price,
        Dprice,
        Off,
      });

      newGrocery.save()
        .then(() => res.status(201).json({ message: "Grocery added", grocery: newGrocery }))
        .catch((err) => res.status(500).json({ error: "Error saving grocery", details: err.message }));
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: "Error adding grocery" });
  }
});

// ✅ Delete a grocery item
router.delete("/:id", async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) return res.status(404).json({ error: "Grocery not found" });

    // Delete image from Cloudinary
    const publicId = grocery.img.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
    await cloudinary.uploader.destroy(publicId);

    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: "Grocery deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting grocery" });
  }
});

module.exports = router;
