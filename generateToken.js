// Import the required libraries
const jwt = require("jsonwebtoken");

// JWT secret from the environment variable (make sure it's set properly)
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key"; // Use your own secret key

// Create a payload (e.g., user info)
const payload = {
  id: "user_id", // Replace with actual user ID or info
  role: "admin" // Replace with actual user role
};

// Create a JWT token with a 1-hour expiration
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

// Print the token
console.log("Generated JWT Token:", token);
