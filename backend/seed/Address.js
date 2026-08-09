const Address = require("../models/Address");
const User = require("../models/User");

exports.seedAddress = async () => {
  try {
    await Address.deleteMany({});
    
    const user = await User.findOne({ email: "priyanshuprince2007@gmail.com" });
    if (!user) {
      console.log("No user found for address seeding");
      return;
    }

    const addresses = [
      {
        user: user._id,
        street: "main 11th",
        city: "Indrapuram",
        state: "Uttar Pradesh",
        phoneNumber: "9452571272",
        postalCode: "201012",
        country: "India",
        type: "Home",
      },
      {
        user: user._id,
        street: "main 18th",
        city: "Noida",
        state: "Uttar Pradesh",
        phoneNumber: "9846286159",
        postalCode: "301273",
        country: "India",
        type: "Business",
      },
    ];

    await Address.insertMany(addresses, { ordered: false });
    console.log("Address seeded successfully");
  } catch (error) {
    console.log(error);
  }
};