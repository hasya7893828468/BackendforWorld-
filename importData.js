const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Card = require("./models/Card");

dotenv.config();
connectDB();

const cards = [
  {
    name: "Doritos",
    img: "/images/9792106b-fb59-415a-a969-a01a6ae37b48.jpeg", // ✅ Corrected image path
    rating: 4.4,
    likes: 1.3,
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Monster",
    img: "/images/af8cd6d9-f067-4df9-9453-b4614c6a93c0.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Lasy",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/ddc5bd9a-bbea-47d6-992f-48a3f762343c.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "KitKat",
    img: "/images/c762b999-8598-4f9f-bc2d-ec4608328565.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/e4a437dd-275b-48ad-963c-0cc334b3ba12.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Magnum",
    img: "/images/Magnum White Chocolate Eisbock.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Oreo",
    img: "/images/Oreo Mint Chocolate Chip Milk Stout.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "naturalis",
    img: "/images/beautiful design of can.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Lays",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Monster",
    img: "/images/af8cd6d9-f067-4df9-9453-b4614c6a93c0.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Lasy",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/ddc5bd9a-bbea-47d6-992f-48a3f762343c.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "KitKat",
    img: "/images/c762b999-8598-4f9f-bc2d-ec4608328565.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/e4a437dd-275b-48ad-963c-0cc334b3ba12.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Magnum",
    img: "/images/Magnum White Chocolate Eisbock.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Oreo",
    img: "/images/Oreo Mint Chocolate Chip Milk Stout.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "naturalis",
    img: "/images/beautiful design of can.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Lays",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Doritos",
    img: "/images/9792106b-fb59-415a-a969-a01a6ae37b48.jpeg", // ✅ Corrected image path
    rating: 4.4,
    likes: 1.3,
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Monster",
    img: "/images/af8cd6d9-f067-4df9-9453-b4614c6a93c0.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Lasy",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/ddc5bd9a-bbea-47d6-992f-48a3f762343c.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "KitKat",
    img: "/images/c762b999-8598-4f9f-bc2d-ec4608328565.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/e4a437dd-275b-48ad-963c-0cc334b3ba12.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Magnum",
    img: "/images/Magnum White Chocolate Eisbock.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Oreo",
    img: "/images/Oreo Mint Chocolate Chip Milk Stout.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "naturalis",
    img: "/images/beautiful design of can.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Lays",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Monster",
    img: "/images/af8cd6d9-f067-4df9-9453-b4614c6a93c0.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Lasy",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/ddc5bd9a-bbea-47d6-992f-48a3f762343c.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "KitKat",
    img: "/images/c762b999-8598-4f9f-bc2d-ec4608328565.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "20% OFF",
  },
  {
    name: "Doritos",
    img: "/images/e4a437dd-275b-48ad-963c-0cc334b3ba12.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
  {
    name: "Magnum",
    img: "/images/Magnum White Chocolate Eisbock.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Oreo",
    img: "/images/Oreo Mint Chocolate Chip Milk Stout.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "naturalis",
    img: "/images/beautiful design of can.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },{
    name: "Lays",
    img: "/images/Lay's chips.jpeg", // ✅ Corrected image path
    rating: 4.4,
    // likes: "1.3k",
    description: "Men's Walking Shoes",
    price: 1123,
    Dprice: 5899,
    Off: "80% OFF",
  },
];

const importData = async () => {
  try {
    await Card.deleteMany(); // ✅ Delete existing data to prevent duplication
    await Card.insertMany(cards);
    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

importData();
