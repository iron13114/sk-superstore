const {seedBrand}=require("./Brand")
const {seedCategory}=require("./Category")
const {seedProduct}=require("./Product")
const {seedUser}=require("./User")
const {seedAddress}=require("./Address")
const {seedWishlist}=require("./Wishlist")
const {seedCart}=require("./Cart")
const {seedReview}=require("./Review")
const {seedOrder}=require("./Order")
const {connectToDB}=require("../database/db")

const User = require("../models/User");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Order = require("../models/Order");

const seedData=async()=>{
    try {
        await connectToDB()
        console.log('Clearing old data from database...');
       await Promise.all([
            User.deleteMany({}),
            Brand.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Address.deleteMany({}),
            Cart.deleteMany({}),
            Wishlist.deleteMany({}),
            Review.deleteMany({}),
            Order.deleteMany({})
        ]);
        
        console.log('Database cleared. Seed [started] please wait..');
        
        // 1. Independent parent structures
        await seedUser();
        await seedBrand();
        await seedCategory();
        
        // 2. Dependent child structures
        await seedProduct();
        await seedAddress();
        
        // 3. User & Product relationship combinations
        await seedCart();
        await seedWishlist();
        await seedReview();
        await seedOrder();
        
        console.log('Seed completed successfully.');
        
    } catch (error) {
        console.error("Seeding failed: ", error);
    }
};

seedData();