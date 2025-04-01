// middleware/roleMiddleware.js
const checkVendorRole = (req, res, next) => {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ success: false, message: "Forbidden: You are not a vendor" });
    }
    next();
  };
  
  module.exports = { checkVendorRole };
  