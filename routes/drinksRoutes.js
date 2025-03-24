const express = require("express");
const router = express.Router();
const Drink = require("../models/Drink");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// const router = express.Router();

// Multer setup (store image in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    let imageUrl = "";
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        return res.status(500).json({ error: "Upload failed" });
      }
      imageUrl = result.secure_url;

      // Save to MongoDB
      const newDrink = new Drink({
        name,
        img: imageUrl, // Store Cloudinary URL instead of local path
        price,
        Dprice,
        Off,
      });

      newDrink.save()
        .then(() => res.status(201).json({ message: "Drink added", drink: newDrink }))
        .catch((err) => res.status(500).json({ error: "Error saving drink", details: err.message }));
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    res.status(500).json({ error: "Error uploading drink", details: error.message });
  }
});

module.exports = router;


// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../tiger");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// Fetch all drinks
router.get("/", async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Add a new drink (with image upload)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const newDrink = new Drink({
      name,
      img: `/tiger/${req.file.filename}`,
      price,
      Dprice,
      Off,
    });

    await newDrink.save();
    res.status(201).json({ message: "Drink added", drink: newDrink });
  } catch (error) {
    res.status(500).json({ error: "Error saving drink", details: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    console.log("Fetching drinks from database...");
    const drinks = await Drink.find();
    console.log("Drinks found:", drinks);

    if (drinks.length === 0) {
      return res.status(404).json({ message: "No drinks found" });
    }

    res.json(drinks);
  } catch (error) {
    console.error("❌ Error fetching drinks:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});



// Get a drink by ID
router.get("/:id", async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) return res.status(404).json({ message: "Drink not found" });
    res.json(drink);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update a drink
router.put("/:id", async (req, res) => {
  try {
    const updatedDrink = await Drink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDrink);
  } catch (error) {
    res.status(500).json({ message: "Error updating drink" });
  }
});

// Delete a drink
router.delete("/:id", async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.json({ message: "Drink deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drink" });
  }
});

module.exports = router;
