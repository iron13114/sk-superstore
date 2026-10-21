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
const uploadRoutes = require('./routes/Upload');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

const app = express();

app.use(helmet());

app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const allowedOrigins = [
    'http://localhost:3000',
    'https://www.sksuperstore.com',
    'https://sksuperstore.com'
];

app.use(cors({
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

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.use(mongoSanitize());
app.use(xss());

const globalLimiter = rateLimit({
    max: 100, 
    windowMs: 15 * 60 * 1000, 
    message: 'Too many requests from this IP, please try again in 15 minutes.',
    standardHeaders: true, 
    legacyHeaders: false, 
});

app.use('/', globalLimiter);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
app.use("/address", addressRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishlistRoutes);

app.use('/api/upload', uploadRoutes);
app.use("/icons", express.static(path.join(__dirname, "public", "icons")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get("/", (req, res) => {
    res.status(200).json({ message: 'running' });
});

module.exports = app;