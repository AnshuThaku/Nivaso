const path = require('path');
// 🔥 Sabse upar: .env file ka sahi path batana zaroori hai
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

const mongoose = require("mongoose");
const { data } = require("./data"); // Path check kar lena agar same folder mein hai
const Listing = require("../models/listing");
const Review = require("../models/review");
const { connectDB } = require("../config/db");

const initDB = async () => {
    try {
        console.log("Step 2: Cleaning old data from Atlas...");
        await Listing.deleteMany({});
        await Review.deleteMany({});
        
        const defaultOwnerId = "69b7099bafb96c1d04221a35"; 

        const updatedData = data.map((obj) => ({
            ...obj,
            owner: defaultOwnerId,
        }));

        console.log(`Step 3: Inserting ${updatedData.length} listings into Atlas...`);
        await Listing.insertMany(updatedData);
        console.log("✅ Data was initialized successfully!");
    } catch (err) {
        console.error("❌ Error inside initDB:", err.message);
        throw err; // Taaki start() isey catch kar sake
    }
};

const start = async () => {
    try {
        console.log("Step 1: Connecting to MongoDB Atlas...");
        await connectDB();
        console.log("🚀 Connected! Starting the seeding process...");
        
        await initDB();
        
        console.log("🏁 All steps completed successfully.");
    } catch (err) {
        console.error("❌ Critical Error in start script:", err);
    } finally {
        console.log("🔌 Closing connection...");
        mongoose.connection.close();
    }
};

// 🔥 YE LINE MAT BHOOLNA: Script ko start karne ke liye
start();