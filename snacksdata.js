require("dotenv").config();
const mongoose = require("mongoose");
const Snack = require("./models/Snack"); // Import the Snack model

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Sample Snacks Data
const snacksData = [
  
  
];

// Function to insert demo data
const seedDB = async () => {
  try {
    await Snack.deleteMany(); // ✅ Clear existing data
    await Snack.insertMany(snacksData); // ✅ Insert new data
    console.log("✅ Snack data inserted successfully");
    mongoose.connection.close(); // ✅ Close connection
  } catch (error) {
    console.log("❌ Error seeding data:", error);
    mongoose.connection.close();
  }
};

seedDB();
