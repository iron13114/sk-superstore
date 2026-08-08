const Review = require("../models/Review");

const reviews = [
  {
    _id: "65c252e3dcd9253acfbaa76c",
    user: "65c2526fdcd9253acfbaa731",
    product: "65c357fe2f21c40d167c27a1",
    rating: 5,
    comment:
      "Exceeded expectations! These Lays chips are a game-changer. Perfectly crispy, amazing flavors, incredible crunch. Best chips ever!",
    createdAt: "2026-07-30T10:01:00.000Z"
  },
  {
    _id: "65c25339dcd9253acfbaa79e",
    user: "65c2526fdcd9253acfbaa731",
    product: "65c357fe2f21c40d167c27a2",
    rating: 5,
    comment:
      "Good, not mind-blowing. Decent detergent, not revolutionary. Cleans clothes well, but the fragrance and stain removal are average.",
    createdAt: "2026-07-30T11:01:00.000Z",
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
