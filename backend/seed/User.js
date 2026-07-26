const User = require("../models/User");

const users = [
  {
    _id: "65b8e564ea5ce114184ccb96",
    name: "demo user",
    email: "demo@gmail.com",
    password:'$2b$10$ikIg31koICfCcjRPCLauA.Y.7.9eO3V2vDr2XP4iFNbIJ/XvPmMJi',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
  {
    _id: "65c2526fdcd9253acfbaa731",
    name: "Priyanshu",
    email: "priyanshu@gmail.com",
    password: '$2b$10$ikIg31koICfCcjRPCLauA.Y.7.9eO3V2vDr2XP4iFNbIJ/XvPmMJi',
    isVerified: true,
    isAdmin: true,
    __v: 0,
  },
];

exports.seedUser = async () => {
  try {
    await User.insertMany(users);
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
