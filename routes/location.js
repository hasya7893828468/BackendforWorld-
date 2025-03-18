const express = require('express');
const router = express.Router();

// Dummy database for storing locations
const locations = {};

// Endpoint to update user location
router.post('/update-location', (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  console.log("📍 Location Updated:", latitude, longitude);

  locations["user"] = { latitude, longitude }; // Save in memory (replace with DB later)
  res.status(200).json({ message: 'Location updated successfully', location: locations["user"] });
});

module.exports = router;
