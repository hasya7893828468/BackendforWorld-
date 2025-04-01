// const express = require("express");
// const router = express.Router();
// const VenderProduct = require("../models/VenderProducts"); // Change the model to VendorProduct
// const multer = require("multer");
// const streamifier = require("streamifier");
// const cloudinary = require("../config/cloudinary");

// // Multer setup (store image in memory)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Add a new vendor product with image upload
// router.post("/", upload.single("img"), async (req, res) => {
//   try {
//     const { name, price, Dprice, Off,category, description } = req.body;
//     if (!req.file) return res.status(400).json({ error: "No image uploaded" });

//     const stream = cloudinary.uploader.upload_stream((error, result) => {
//       if (error) {
//         return res.status(500).json({ error: "Upload failed" });
//       }

//       // Save to MongoDB
//       const newVenderProduct = new VenderProduct({
//         name,
//         img: result.secure_url, // Cloudinary URL
//         price,
//           Dprice,
//           category, // Add missing field
//           description, // Add missing field
//         Off,
//       });

//       newVenderProduct.save()
//         .then(() => res.status(201).json({ message: "Vendor product added", product: newVenderProduct }))
//         .catch((err) => res.status(500).json({ error: "Error saving vendor product", details: err.message }));
//     });

//     streamifier.createReadStream(req.file.buffer).pipe(stream);
//   } catch (error) {
//     res.status(500).json({ error: "Error uploading vendor product", details: error.message });
//   }
// });

// // Fetch all vendor products
// router.get("/", async (req, res) => {
//   try {
//     console.log("Fetching vendor products from database...");
//     const products = await VenderProduct.find();
//     console.log("Vendor products found:", products);

//     if (products.length === 0) {
//       return res.status(404).json({ message: "No vendor products found" });
//     }

//     res.json(products);
//   } catch (error) {
//     console.error("❌ Error fetching vendor products:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // Get a vendor product by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await VenderProduct.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Vendor product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // Update a vendor product
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedProduct = await VenderProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating vendor product" });
//   }
// });

// // Delete a vendor product
// router.delete("/:id", async (req, res) => {
//     try {
//       const product = await VendorProduct.findByIdAndDelete(req.params.id);
//       if (!product) return res.status(404).json({ message: "Product not found" });
//       res.json({ message: "Product deleted" });
//     } catch (error) {
//       res.status(500).json({ message: "Error deleting product", error });
//     }
//   });

// module.exports = router;
