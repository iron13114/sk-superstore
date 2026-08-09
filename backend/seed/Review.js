const Review = require("../models/Review");
const User = require("../models/User");
const Product = require("../models/Product");

exports.seedReview = async () => {
  try {
    await Review.deleteMany({});
    
    const user = await User.findOne({ email: "priyanshuprince2007@gmail.com" });
    const lays = await Product.findOne({ title: "Lays Classic Chips" });
    const surf = await Product.findOne({ title: "Surf Excel Detergent" });
    
    if (!user) {
      console.log("No user found for review seeding");
      return;
    }

    const reviews = [];
    
    if (lays) {
      reviews.push({
        user: user._id,
        product: lays._id,
        rating: 5,
        comment: "Exceeded expectations! These Lays chips are a game-changer. Perfectly crispy, amazing flavors, incredible crunch. Best chips ever!",
        createdAt: new Date("2026-07-30T10:01:00.000Z")
      });
    }
    
    if (surf) {
      reviews.push({
        user: user._id,
        product: surf._id,
        rating: 5,
        comment: "Good, not mind-blowing. Decent detergent, not revolutionary. Cleans clothes well, but the fragrance and stain removal are average.",
        createdAt: new Date("2026-07-30T11:01:00.000Z"),
      });
    }

    if (reviews.length > 0) {
      await Review.insertMany(reviews, { ordered: false });
    }
    console.log("Review seeded successfully");
  } catch (error) {
    console.log(error);
  }
};