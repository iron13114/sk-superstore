const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { connectToDB } = require("../database/db");

const { seedUser } = require("./User");
const { seedBrand } = require("./Brand");
const { seedCategory } = require("./Category");
const { seedProduct } = require("./Product");
const { seedAddress } = require("./Address");
const { seedCart } = require("./Cart");
const { seedWishlist } = require("./Wishlist");
const { seedReview } = require("./Review");
const { seedOrder } = require("./Order");

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