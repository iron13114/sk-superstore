require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
const path = require("path");
const express = require('express');
const { connectToDB } = require('./database/db');
const mongoose = require("mongoose");

exports.connectToDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Database connection failed");
        console.error(error);
        throw error; 
    }
};