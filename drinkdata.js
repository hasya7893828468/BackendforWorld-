require('dotenv').config();
const mongoose = require('mongoose');
const Drink = require('./models/Drink');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

const drinksData = [
  {
    name: 'Coca-Cola',
    description: 'Refreshing cold drink with a classic taste.',
    price: 50,
    Dprice: 60,
    Off: '16% Off',
    rating: 4.5,
    img: '/imgdrink/download (2).jpeg',
  },
  {
    name: 'Pepsi',
    description: 'A popular soda with a bold flavor.',
    price: 45,
    Dprice: 55,
    Off: '18% Off',
    rating: 4.3,
    img: '/imgdrink/Design for Pepsi soda.jpeg',
  },
  {
    name: 'Sprite',
    description: 'Lemon-lime flavored soft drink.',
    price: 40,
    Dprice: 50,
    Off: '20% Off',
    rating: 4.4,
    img: '/imgdrink/download (4).jpeg',
  },
  {
    name: 'Fanta',
    description: 'Orange-flavored fizzy drink.',
    price: 42,
    Dprice: 52,
    Off: '19% Off',
    rating: 4.2,
    img: '/imgdrink/Fanta Orange.jpeg',
  },
  {
    name: 'Mountain Dew',
    description: 'Citrus-flavored energy booster.',
    price: 48,
    Dprice: 58,
    Off: '17% Off',
    rating: 4.1,
    img: '/imgdrink/Mountain Dew Product Ad.jpeg',
  },
];

// Insert demo data
const seedDB = async () => {
  try {
    await Drink.deleteMany(); // Clear existing data
    await Drink.insertMany(drinksData); // Insert new data
    console.log('Demo data inserted successfully');
    mongoose.connection.close(); // Close connection
  } catch (error) {
    console.log('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedDB();
