const Brand = require("../models/Brand");

const brands = [
  { 
    _id: "65b8e564ea5ce114184ccb01", 
    name: "HUL" 
  },
  { _id: "65b8e564ea5ce114184ccb02", name: "ITC" },
  { _id: "65b8e564ea5ce114184ccb03", name: "Nestle" },
  { _id: "65b8e564ea5ce114184ccb04", name: "Britannia" },
  { _id: "65b8e564ea5ce114184ccb05", name: "Parle" },
  { _id: "65b8e564ea5ce114184ccb06", name: "PepsiCo" },
  { _id: "65b8e564ea5ce114184ccb07", name: "Coca-Cola" },
  { _id: "65b8e564ea5ce114184ccb08", name: "Dabur" },
  { _id: "65b8e564ea5ce114184ccb09", name: "Colgate" }
];

exports.seedBrand = async () => {
  try {
    await Brand.insertMany(brands);
    console.log('Brand seeded successfully');
  } catch(error){
    console.log(error);
  }
};