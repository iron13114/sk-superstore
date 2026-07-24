const Cart = require("../models/Cart");

const cartItems = [
  {
    _id: "65c357fe2f21c40d167c276b",
    user: "65b8e564ea5ce114184ccb96",
    product: "65c357fe2f21c40d167c27a1", 
    quantity: 10, 
  }
];

exports.seedCart = async () => {
  try {
    await Cart.insertMany(cartItems);
    console.log("Cart seeded successfully");
  } catch (error) { console.log(error); }
};