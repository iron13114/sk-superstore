const User = require("../models/User");
const bcrypt = require('bcryptjs');

const PASSWORD = process.env.ADMIN_PASSWORD;
exports.seedUser = async () => {
    await User.deleteMany({});
    
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    const users = [
        {
            name: 'Admin',
            email: 'skgeneralstores2016@gmail.com',
            password: hashedPassword,
            isAdmin: true,
            isVerified: true
        },
        {
            name: 'Priyanshu',
            email: 'priyanshuprince2007@gmail.com',
            password: hashedPassword,
            isAdmin: false,
            isVerified: true
        },
        {
            name: 'Test User',
            email: 'test@gmail.com',
            password: hashedPassword,
            isAdmin: false,
            isVerified: true
        }
    ];

    await User.insertMany(users, { ordered: false });
    console.log('Users seeded successfully');
};