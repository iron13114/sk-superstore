const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { connectToDB } = require("../database/db");

const { seedUser } = require("./user");
const { seedBrand } = require("./brand");
const { seedCategory } = require("./category");
const { seedProduct } = require("./product");
const { seedAddress } = require("./address");
const { seedCart } = require("./cart");
const { seedWishlist } = require("./wishlist");
const { seedReview } = require("./review");
const { seedOrder } = require("./order");

const seedData = async () => {
  try {
    await connectToDB();
    console.log('Database connected. Seed [started] please wait..');
    
    await seedUser();
    await seedBrand();
    await seedCategory();
    await seedProduct();
    await seedAddress();
    await seedCart();
    await seedWishlist();
    await seedReview();
    await seedOrder();
    
    console.log('Seed completed successfully.');
    process.exit(0);
    
  } catch (error) {
    console.error("Seeding failed: ", error);
    process.exit(1);
  }
};

seedData();