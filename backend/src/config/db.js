const mongoose = require("mongoose");



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
      
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};;

// THE CRUCIAL FIX: Export it as an object so the { connectDB } import works!
module.exports = { connectDB };



