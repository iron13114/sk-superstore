const Review = require("../models/Review");

const reviews = [
  {
    _id: "65c252e3dcd9253acfbaa76c",
    user: "65c2526fdcd9253acfbaa731",
    product: "65c357fe2f21c40d167c27a1",
    rating: 5,
    comment:
      "Exceeded expectations! This phone is a game-changer. Lightning fast, stunning camera, incredible battery life. Best phone ever! ",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25339dcd9253acfbaa79e",
    user: "65c2526fdcd9253acfbaa731",
    product: "65c357fe2f21c40d167c27a2",
    rating: 3,
    comment:
      "Good, not mind-blowing. Decent phone, not revolutionary. Average camera, battery life, performance.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
];

exports.seedReview = async () => {
  try {
    await Review.insertMany(reviews,{ordered: false});
    console.log("Review seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
