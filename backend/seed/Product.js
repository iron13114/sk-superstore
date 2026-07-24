const Product = require("../models/Product");

const products = [
  {
    _id: "65c357fe2f21c40d167c27a1",
    title: "Lays Classic Chips",
    description: "Potato chips packet - Wholesale Pack",
    price: 20,
    discountPercentage: 0,
    stockQuantity: 500,
    brand: "65b8e564ea5ce114184ccb06",      
    category: "65c357fe2f21c40d167c27c1",   
    thumbnail: "https://via.placeholder.com/150",
    images: ["https://via.placeholder.com/150"],
    isDeleted: false,
  }, 
  {
    _id: "65c357fe2f21c40d167c27a2",
    title: "Surf Excel Detergent",
    description: "Cloth washing powder 1kg",
    price: 140,
    discountPercentage: 0,
    stockQuantity: 200,
    brand: "65b8e564ea5ce114184ccb01",    
    category: "65c357fe2f21c40d167c27c5",  
    thumbnail: "https://via.placeholder.com/150",
    images: ["https://via.placeholder.com/150"],
    isDeleted: false,
  }
];

exports.seedProduct = async () => {
  try {
    await Product.insertMany(products);
    console.log("Product seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
