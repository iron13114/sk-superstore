const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

exports.seedCart = async () => {
  try {
    await Cart.deleteMany({});
    
    const user = await User.findOne({ email: "priyanshuprince2007@gmail.com" });
    const product = await Product.findOne({ title: "Lays Classic Chips" });
    
    if (!user || !product) {
      console.log("Missing user or product for cart seed");
      return;
    }

    const cartItems = [
      {
        user: user._id,
        product: product._id,
        quantity: 10,
      }
    ];

    await Cart.insertMany(cartItems, { ordered: false });
    console.log("Cart seeded successfully");
  } catch (error) { 
    console.log(error); 
  }
};