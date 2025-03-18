const express = require("express");
const mongoose = require("mongoose");
const Card = require("../models/Card");
const multer = require("multer");

const router = express.Router();

// ✅ Get all cards with Pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const cards = await Card.find().skip(skip).limit(limit);
    const total = await Card.countDocuments();

    res.json({
      data: cards,
      page,
      hasNextPage: total > skip + limit,
    });
  } catch (error) {
    console.error("❌ Error fetching cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch a card by its Name (Fixed: Removed Duplicate Route)
// router.get("/name/:name", async (req, res) => {
//   try {
//     const name = decodeURIComponent(req.params.name);
//     const card = await Card.findOne({ name });

//     if (!card) {
//       return res.status(404).json({ message: "Card not found" });
//     }
//     res.json(card);
//   } catch (error) {
//     console.error("❌ Error fetching card by name:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
// ✅ Ensure this route exists in your backend
router.get("/name/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name).trim();
    const card = await Card.findOne({ name: { $regex: `^${name}$`, $options: "i" } });

    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json(card);
  } catch (error) {
    console.error("❌ Error fetching card by name:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Fetch a card by ID (Fixed Error Handling)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.warn(`⚠️ Invalid ObjectId received: ${req.params.id}`);
      return res.status(400).json({ error: "Invalid card ID format" });
    }

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    console.error("❌ Error fetching card by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add a new card
router.post("/", async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error("❌ Error adding card:", error);
    res.status(500).json({ error: "Error adding card" });
  }
});

// ✅ Delete a card by ID
router.delete("/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting card:", error);
    res.status(500).json({ error: "Error deleting card" });
  }
});

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Update card details (including Image Upload)
router.put("/update/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, price, Dprice, Off, description, rating } = req.body;
    const updatedFields = { name, price, Dprice, Off, description, rating };

    if (req.file) {
      updatedFields.img = `/uploads/${req.file.filename}`;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});

module.exports = router;
