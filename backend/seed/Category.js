const Category = require("../models/Category");

exports.seedCategory = async () => {
  try {
    const defaultCategories = [
      { name: "Modi", icon: "" },
      { name: "Chocolate and Candy", icon: "" },
      { name: "Biscuits", icon: "🍪" },
      { name: "Agarbatti", icon: "🪔" },
      { name: "Shampoo", icon: "🧴" },
      { name: "Soap", icon: "🧼" },
      { name: "Detergent", icon: "" },
      { name: "Dry Fruits", icon: "🥜" },
      { name: "Boss", icon: "" },
      { name: "Lays", icon: "🥔" },
      { name: "Kurkure", icon: "" },
      { name: "Ketchup", icon: "🍅" },
      { name: "Cigarette", icon: "" }
    ];

    const existingCategories = await Category.find({}, { name: 1 });
    const existingNames = new Set(existingCategories.map(c => c.name));

    const newCategories = defaultCategories.filter(
      cat => !existingNames.has(cat.name)
    );

    if (newCategories.length > 0) {
      await Category.insertMany(newCategories, { ordered: false });
      console.log(`✅ Inserted ${newCategories.length} new categories: ${newCategories.map(c => c.name).join(", ")}`);
    } else {
      console.log("ℹ️ All categories already exist. Nothing to seed.");
    }
  } catch (error) {
    console.error("Error during category seed:", error);
  }
};