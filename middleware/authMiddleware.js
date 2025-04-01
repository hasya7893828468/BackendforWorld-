const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("🚨 JWT_SECRET is missing! Add it to your environment variables.");
  process.exit(1); // Stop server execution
}

module.exports = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] 📩 Incoming Headers:`, req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`[${new Date().toISOString()}] ❌ No token provided or incorrect format.`);
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // Hide token in logs (even in dev)
    console.log(`[${new Date().toISOString()}] 🔑 Token received: [HIDDEN]`);

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    console.log(`[${new Date().toISOString()}] ✅ Authenticated User:`, {
      id: req.user.id,
      role: req.user.role || "user",
    });

    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Token Verification Error:`, error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
