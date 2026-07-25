const mongoose = require("mongoose");

exports.connectToDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined. Verify backend/.env exists and is formatted correctly.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Database connection failed");
        console.error(error);
        throw error; 
    }
};