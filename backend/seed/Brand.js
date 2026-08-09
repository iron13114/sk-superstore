const Brand = require("../models/Brand");

const brands = [
  { name: "HUL" },
  { name: "ITC" },
  { name: "Nestle" },
  { name: "Britannia" },
  { name: "Parle" },
  { name: "PepsiCo" },
  { name: "Coca-Cola" },
  { name: "Dabur" },
  { name: "Colgate" }
];

exports.seedBrand = async () => {
  try {
    await Brand.deleteMany({});
    await Brand.insertMany(brands, { ordered: false });
    console.log('Brand seeded successfully');
  } catch(error) {
    console.log(error);
  }
};