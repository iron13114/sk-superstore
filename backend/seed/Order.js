const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Address = require("../models/Address");

exports.seedOrder = async () => {
  try {
    await Order.deleteMany({});
    
    const user = await User.findOne({ email: "priyanshuprince2007@gmail.com" });
    const product = await Product.findOne({ title: "Lays Classic Chips" });
    const address = await Address.findOne({ user: user?._id, type: "Home" });
    
    if (!user || !product || !address) {
      console.log("Missing data for order seed");
      return;
    }

    const orders = [
      {
        user: user._id,
        item: [
          {
            user: user._id,
            product: product._id,
            quantity: 50
          }
        ],
        address: [address._id],
        status: "Pending",
        paymentMode: "CASH",
        total: 1000,
        createdAt: new Date("2026-07-15T10:36:15.151Z"),
      },
    ];

    await Order.insertMany(orders, { ordered: false });
    console.log("Order seeded successfully");
  } catch (error) { 
    console.log(error); 
  }
};