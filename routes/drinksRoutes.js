const express = require("express");
const router = express.Router();
const Drink = require("../models/Drink");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/authMiddleware");
const { checkVendorRole } = require("../middleware/roleMiddleware"); // Import the role middleware

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

// Helper function for uploading to Cloudinary
const uploadImageToCloudinary = (buffer, public_id) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "drinks",
        public_id,
        transformation: { width: 800, height: 600, crop: "limit" }
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Create Drink with Cloudinary upload
router.post("/", auth, checkVendorRole, async (req, res) => {
  try {
    const { name, price, Dprice, Off } = req.body;

    if (!name || !price || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await uploadImageToCloudinary(req.file.buffer, `${req.user.id}_${Date.now()}`);

    const newDrink = new Drink({
      vendor: req.user.id,
      name,
      img: result.secure_url,
      price: parseFloat(price),
      Dprice: Dprice ? parseFloat(Dprice) : null,
      Off: Off ? parseInt(Off) : null,
      cloudinaryId: result.public_id
    });

    await newDrink.save();
    res.status(201).json({ message: "Drink created successfully", drink: newDrink });
  } catch (error) {
    res.status(500).json({ error: "Image upload or server error", details: error.message });
  }
});

// Get all drinks with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [drinks, total] = await Promise.all([
      Drink.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Drink.countDocuments()
    ]);

    res.json({ total, page, pages: Math.ceil(total / limit), drinks });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get drinks by vendor
router.get("/vendor", auth, checkVendorRole, async (req, res) => {
  try {
    const drinks = await Drink.find({ vendor: req.user.id });
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get single drink
router.get("/:id", async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }
    res.json(drink);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update drink
router.put("/:id", auth, checkVendorRole, upload.single("img"), async (req, res) => {
  try {
    const drink = await Drink.findOne({ _id: req.params.id, vendor: req.user.id });

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    const updates = {
      name: req.body.name || drink.name,
      price: req.body.price ? parseFloat(req.body.price) : drink.price,
      Dprice: req.body.Dprice ? parseFloat(req.body.Dprice) : drink.Dprice,
      Off: req.body.Off ? parseInt(req.body.Off) : drink.Off
    };

    if (req.file) {
      await cloudinary.uploader.destroy(drink.cloudinaryId);

      const result = await cloudinary.uploader.upload(req.file.buffer, {
        public_id: drink.cloudinaryId,
        overwrite: true
      });

      updates.img = result.secure_url;
      updates.cloudinaryId = result.public_id;
    }

    const updatedDrink = await Drink.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.json(updatedDrink);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Delete drink
router.delete("/:id", auth, checkVendorRole, async (req, res) => {
  try {
    const drink = await Drink.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    await cloudinary.uploader.destroy(drink.cloudinaryId);

    res.json({ message: "Drink deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
