const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = (req, res, next) => {
  console.log("📩 Incoming Headers:", req.headers); // Log all headers

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided or incorrect format:", authHeader);
    return res.status(401).json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract the token
    console.log("🔑 Extracted Token:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("✅ Authenticated User:", req.user);

    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
