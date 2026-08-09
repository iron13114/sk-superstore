const User = require("../models/User");
const bcrypt = require('bcryptjs');

exports.seedUser = async () => {
    // FORCE DELETE before insert
    await User.deleteMany({});
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
        {
            name: 'Admin',
            email: 'admin@sksuperstore.com',
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