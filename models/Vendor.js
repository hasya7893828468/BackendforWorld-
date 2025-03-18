const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    latitude: { type: Number, default: null },  // ✅ Store latitude
    longitude: { type: Number, default: null }, // ✅ Store longitude
  },
});

module.exports = mongoose.model("Vendor", VendorSchema);
