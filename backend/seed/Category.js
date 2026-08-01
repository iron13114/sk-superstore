const Category = require("../models/Category");

const categories = [
 { 
   _id: "65c357fe2f21c40d167c27c1", 
   name: "Snacks" 
 },
 { _id: "65c357fe2f21c40d167c27c2", name: "Biscuits" },
 { _id: "65c357fe2f21c40d167c27c3", name: "Beverages" },
 { _id: "65c357fe2f21c40d167c27c4", name: "Personal Care" },
 { _id: "65c357fe2f21c40d167c27c5", name: "Household" },
 { _id: "65c357fe2f21c40d167c27c6", name: "Grocery" }
];

exports.seedCategory = async () => {
 try {
   await Category.insertMany(categories,{ordered: false});
   console.log("Category seeded successfully");
 }
 catch(error){
   console.log(error);
 }
};