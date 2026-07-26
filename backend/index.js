// backend/index.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require('./routes/Address');
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const { connectToDB } = require("./database/db");
const { seedUser } = require("./seed/User");
const { seedBrand } = require("./seed/Brand");
const { seedCategory } = require("./seed/Category");
const { seedProduct } = require("./seed/Product");
const { seedAddress } = require("./seed/Address");
const { seedCart } = require("./seed/Cart");
const { seedOrder } = require("./seed/Order");
const { seedReview } = require("./seed/Review");
const { seedWishlist } = require("./seed/Wishlist");

const server = express();

// Connect DB after dotenv is initialized
connectToDB();
seedUser(); 
seedBrand();
seedCategory();
seedProduct();
seedAddress();
seedCart();
seedOrder();
seedReview();
seedWishlist();

server.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);

server.get("/", (req, res) => {
    res.status(200).json({ message: 'running' });
});

if (process.env.NODE_ENV !== 'production') {
    server.listen(8000, () => {
        console.log('server [STARTED] ~ http://localhost:8000');
    });
}

module.exports = server;