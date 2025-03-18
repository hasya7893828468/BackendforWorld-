const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// ✅ Assign Order to the Nearest Vendor
exports.assignOrderToVendor = async (req, res) => {
    try {
        const { orderId, latitude, longitude } = req.body;

        if (!orderId || !latitude || !longitude) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find all available vendors with location data
        const vendors = await Vendor.find({
            "location.latitude": { $exists: true },
            "location.longitude": { $exists: true }
        });

        if (vendors.length === 0) {
            return res.status(404).json({ error: "No vendors available" });
        }

        let nearestVendor = null;
        let minDistance = Infinity;

        vendors.forEach((vendor) => {
            const distance = getDistance(
                latitude,
                longitude,
                vendor.location.latitude,
                vendor.location.longitude
            );
            if (distance < minDistance && distance <= 5) { // ✅ Only vendors within 5km
                minDistance = distance;
                nearestVendor = vendor;
            }
        });

        if (!nearestVendor) {
            return res.status(404).json({ error: "No nearby vendors found" });
        }

        // ✅ Assign the order to the nearest vendor
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.vendorId = nearestVendor._id;
        order.status = "accepted"; // ✅ Change order status to accepted
        await order.save();

        // ✅ Update Vendor with Assigned Order
        nearestVendor.assignedOrders.push(orderId);
        await nearestVendor.save();

        res.status(200).json({ message: "Order assigned successfully", order });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// ✅ Helper Function to Calculate Distance
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// ✅ Get Orders Assigned to a Vendor
exports.getVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // ✅ Find all orders assigned to the vendor
        const orders = await Order.find({ vendorId });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders assigned to this vendor" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
