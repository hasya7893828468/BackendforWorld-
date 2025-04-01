const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = {
  user: (req, res, next) => {
    console.log(`[${new Date().toISOString()}] 📩 Incoming Headers:`, req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log(`[${new Date().toISOString()}] ❌ No token provided or incorrect format:`, authHeader);
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
      const token = authHeader.split(" ")[1];

      console.log(`[${new Date().toISOString()}] 🔑 Extracted Token: ${process.env.NODE_ENV === "development" ? token : "[HIDDEN]"}`);

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log(`[${new Date().toISOString()}] ✅ Authenticated User:`, req.user);

      next();
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Token Verification Error:`, error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
      }

      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  },

  vendor: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded || !decoded.role || decoded.role !== "vendor") {
        return res.status(403).json({ success: false, message: "Access denied: Only vendors can perform this action" });
      }

      req.vendor = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  }
};
