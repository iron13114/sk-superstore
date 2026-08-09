const Category = require("../models/Category");

const categories = [
  { name: "Snacks" },
  { name: "Biscuits" },
  { name: "Beverages" },
  { name: "Personal Care" },
  { name: "Household" },
  { name: "Grocery" }
];

exports.seedCategory = async () => {
  try {
    await Category.deleteMany({});
    await Category.insertMany(categories, { ordered: false });
    console.log("Category seeded successfully");
  } catch(error) {
    console.log(error);
  }
};