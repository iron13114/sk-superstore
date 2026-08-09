const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

exports.seedProduct = async () => {
  try {
    await Product.deleteMany({});
    
    const pepsico = await Brand.findOne({ name: "PepsiCo" });
    const hul = await Brand.findOne({ name: "HUL" });
    const snacks = await Category.findOne({ name: "Snacks" });
    const household = await Category.findOne({ name: "Household" });

    const products = [
      {
        title: "Lays Classic Chips",
        description: "Potato chips packet - Wholesale Pack",
        price: 20,
        discountPercentage: 0,
        stockQuantity: 500,
        brand: pepsico?._id,
        category: snacks?._id,
        thumbnail: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150"],
        isDeleted: false,
      }, 
      {
        title: "Surf Excel Detergent",
        description: "Cloth washing powder 1kg",
        price: 140,
        discountPercentage: 0,
        stockQuantity: 200,
        brand: hul?._id,
        category: household?._id,
        thumbnail: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150"],
        isDeleted: false,
      }
    ];

    await Product.insertMany(products, { ordered: false });
    console.log("Product seeded successfully");
  } catch (error) {
    console.log(error);
  }
};