const mongoose = require("mongoose");

exports.connectToDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Database connection failed");
        console.error(error);
        throw error; 
    }
};