const Order = require("../models/Order");

const orders = [
  {
    _id: "65c2658db53f820728d0745a",
    user: "65b8e564ea5ce114184ccb96",
    item: [
      {
        user: "65b8e564ea5ce114184ccb96",
        product: {
          _id: "65c357fe2f21c40d167c27a1",
          title: "Lays Classic Chips",
          description: "Potato chips packet",
          price: 20,
          brand: {
            _id: "65b8e564ea5ce114184ccb06",
            name: "PepsiCo"
          },
          category: "65c357fe2f21c40d167c27c1"
        },
        quantity: 50
      }
    ],
    address: [
      {
        _id: "65c26398e1e1a2106ac8fbd5",
        user: "65b8e564ea5ce114184ccb96",
        street: "main 11th",
        city: "Indrapuram",
        state: "Uttar Pradesh",
        phoneNumber: "9452571272",
        postalCode: "201012",
        country: "India",
        type: "Home",
      },
    ],
    status: "Pending",
    paymentMode: "CASH",
    total: 1000,
    createdAt: "2026-07-15T10:36:15.151Z",
  },
];

exports.seedOrder = async () => {
  try {
    await Order.insertMany(orders,{ordered: false});
    console.log("Order seeded successfully");
  } catch (error) { console.log(error); }
};