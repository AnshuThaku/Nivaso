const { data } = require("../init/data");
const Listing = require("../models/listing");
const Review = require("../models/review");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");

const initDB = async () => {
  // Clear out the old data
  await Listing.deleteMany({});
  await Review.deleteMany({});
  
  // 🔥 FIX: Apna ek User ID yahan daalein (MongoDB Compass se copy karke)
  // Taaki saari properties ka koi ek malik (owner) ban jaye
  const defaultOwnerId = "69b68b947e988be229dd192c"; 

  // Har ek listing mein naya 'owner' field add kar rahe hain
  const updatedData = data.map((obj) => ({
      ...obj,
      owner: defaultOwnerId,
  }));

  // Ab raw data ki jagah updatedData insert karenge
  await Listing.insertMany(updatedData);
  console.log("Data was initialized successfully!");
};