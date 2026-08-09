const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Product = require("../models/Product");

exports.seedWishlist = async () => {
  try {
    await Wishlist.deleteMany({});
    
    const user = await User.findOne({ email: "priyanshuprince2007@gmail.com" });
    const product = await Product.findOne({ title: "Lays Classic Chips" });
    
    if (!user || !product) {
      console.log("Missing user or product for wishlist seed");
      return;
    }

    const wishlistItems = [
      {
        user: user._id,
        product: product._id,
        note: "Stock up needed before festival season sales."
      }
    ];

    await Wishlist.insertMany(wishlistItems, { ordered: false });
    console.log("Wishlist seeded successfully");
  } catch (error) {
    console.log(error);
  }
};