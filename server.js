const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db"); // ✅ MongoDB Connection

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Handle cookies

// ✅ CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
        "http://localhost:8084",
        "http://localhost:8085",
        "http://localhost:8086",

        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5177",
        "http://localhost:5180",
        "http://localhost:5181",
        "http://localhost:5182",
        "http://localhost:5183",
        "http://localhost:5184",
        "http://localhost:5185",
        "http://localhost:5186",
        "http://localhost:5187",
        "https://mainprojectreal.onrender.com",  // ✅ Allow deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests

// ✅ Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/tiger', express.static(path.join(__dirname, 'tiger')));

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/imgdrink", express.static(path.join(__dirname, "public/imgdrink")));

// ✅ Import Routes
const drinksRoutes = require('./routes/drinksRoutes');
const snackRoutes = require('./routes/snackRoutes');
const groceryRoutes = require("./routes/groceryRoutes");
const vendorCartRoutes = require("./routes/vendorCart");
const userCartRoutes = require("./routes/userCartRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes").default || require("./routes/orderRoutes");
const locationRoutes = require("./routes/location");
const cardRoutes = require("./routes/cardRoutes");
const completedOrdersRoutes = require("./routes/completedOrders");
const productRoutes = require("./routes/productRoutes");
const userOrdersRoutes = require("./routes/userOrders");
// const cartRoutes = require("./routes/cartRoutes"); // ✅ Check the path

// ✅ Define API Routes
app.use("/api/cart", require("./routes/cartRoutes"));

app.use("/api/vendor-cart", vendorCartRoutes);
app.use("/api/user-cart", userCartRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/completed-orders", completedOrdersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user-orders", userOrdersRoutes);
app.use('/api/drinks', drinksRoutes);
app.use('/api/snacks', snackRoutes);
app.use("/api/groceries", groceryRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("🚀 API is running...testing...");
});

// ✅ Initialize Socket.io with CORS
const io = new Server(server, {
    cors: corsOptions,
    transports: ["websocket", "polling"], // ✅ Ensure smooth connection
});

// ✅ Handle Socket.io Events
io.on("connection", (socket) => {
    console.log("🔗 A user connected");

    socket.on("updateCart", () => {
        io.emit("cartUpdated"); // Notify all clients to refresh cart
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected");
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
