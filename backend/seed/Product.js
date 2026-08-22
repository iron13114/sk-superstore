const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

// Helper function to find a category dynamically using regex keywords
const findCategory = (categories, keywords) => {
  return categories.find((cat) =>
    keywords.some((kw) => cat.name.toLowerCase().includes(kw.toLowerCase()))
  );
};

// Helper function to find a brand dynamically using regex keywords
const findBrand = (brands, keywords) => {
  return brands.find((b) =>
    keywords.some((kw) => b.name.toLowerCase().includes(kw.toLowerCase()))
  );
};

exports.seedProduct = async () => {
  try {
    const productCount = await Product.countDocuments({});

    // Safe guard: only seed if the products collection is completely empty
    if (productCount > 0) {
      console.log(` Found ${productCount} existing products. Skipping product seed to preserve DB changes.`);
      return;
    }

    console.log("Fetching live brands and categories from DB for product seeding...");
    const [allBrands, allCategories] = await Promise.all([
      Brand.find({}),
      Category.find({})
    ]);

    if (!allCategories.length || !allBrands.length) {
      console.warn("⚠️ Cannot seed products: Categories or Brands collections are empty in DB.");
      return;
    }

    // Dynamic matching from existing MongoDB documents
    const pepsico = findBrand(allBrands, ["PepsiCo", "Pepsi", "Lays"]) || allBrands[0];
    const hul = findBrand(allBrands, ["HUL", "Hindustan Unilever"]) || allBrands[0];

    const snacksCategory = findCategory(allCategories, ["Lays and Nmakeen", "Snacks", "Kurkure"]) || allCategories[0];
    const detergentCategory = findCategory(allCategories, ["Detergent", "Household", "soap"]) || allCategories[0];

    const products = [
      {
        title: "Lays Classic Chips",
        description: "Potato chips packet - Wholesale Pack",
        price: 20,
        discountPercentage: 0,
        stockQuantity: 500,
        brand: pepsico._id,
        category: snacksCategory._id,
        thumbnail: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150"],
        isDeleted: false,
        type: "Snacks",
        tiers: [
          {
            type: "single",
            label: "Single Unit",
            quantity: 1,
            price: 20,
            discount: 0,
            discountPercentage: 0,
            stock: 500,
            stockQuantity: 500
          },
          {
            type: "pack",
            label: "Pack of 10",
            quantity: 10,
            price: 190,
            discount: 5,
            discountPercentage: 5,
            stock: 50,
            stockQuantity: 50
          },
          {
            type: "carton",
            label: "Carton of 50",
            quantity: 50,
            price: 900,
            discount: 10,
            discountPercentage: 10,
            stock: 10,
            stockQuantity: 10
          }
        ]
      },
      {
        title: "Surf Excel Detergent",
        description: "Cloth washing powder 1kg",
        price: 140,
        discountPercentage: 0,
        stockQuantity: 200,
        brand: hul._id,
        category: detergentCategory._id,
        thumbnail: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150"],
        isDeleted: false,
        type: "Detergent",
        tiers: [
          {
            type: "single",
            label: "Single Unit",
            quantity: 1,
            price: 140,
            discount: 0,
            discountPercentage: 0,
            stock: 200,
            stockQuantity: 200
          },
          {
            type: "pack",
            label: "Pack of 6",
            quantity: 6,
            price: 800,
            discount: 5,
            discountPercentage: 5,
            stock: 30,
            stockQuantity: 30
          },
          {
            type: "carton",
            label: "Carton of 24",
            quantity: 24,
            price: 3000,
            discount: 10,
            discountPercentage: 10,
            stock: 10,
            stockQuantity: 10
          }
        ]
      }
    ];

    await Product.insertMany(products, { ordered: false });
    console.log("✅ Products seeded successfully with live DB Category and Brand IDs.");
  } catch (error) {
    console.error("❌ Error during product seeding:", error);
  }
};