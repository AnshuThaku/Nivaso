const mongoose = require("mongoose");



const connectDB = async () => {
  try {
    // Note: Make sure your MONGO_URI is defined in your .env file!
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Nivaso");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// THE CRUCIAL FIX: Export it as an object so the { connectDB } import works!
module.exports = { connectDB };



