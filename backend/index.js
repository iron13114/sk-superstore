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

server.set('etag', false);
server.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const allowedOrigins = [
    'http://localhost:3000',
    'https://www.sksuperstore.com',
    'https://sksuperstore.com'
];

server.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
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
server.use("/icons", express.static(path.join(__dirname, "public", "icons")));

server.get("/", (req, res) => {
    res.status(200).json({ message: 'running' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`server [STARTED] ~ port ${PORT}`);
});

connectToDB().then(() => {
    console.log("DB connected, starting seeds...");
}).catch(err => {
    console.error("DB connection failed:", err);
});

module.exports = server;
