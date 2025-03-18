const express = require('express');
const router = express.Router();
const { assignOrderToVendor, getVendorOrders } = require('../controllers/vendorController');

// Assign order to nearest available vendor
router.post('/assign-order', assignOrderToVendor);

// Get all orders assigned to a vendor
router.get('/orders/:vendorId', getVendorOrders);

module.exports = router;
