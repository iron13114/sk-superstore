const Wishlist = require("../models/Wishlist");

const wishlistItems = [
  {
    _id: "65c2441232078478e340ab60",
    user: "65b8e564ea5ce114184ccb96",
    product: "65c357fe2f21c40d167c27a1",
    note: "Stock up needed before festival season sales."
  }
];

exports.seedWishlist = async () => {
  try {
    await Wishlist.insertMany(wishlistItem,{ordered: false});
    console.log("Wishlist seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
