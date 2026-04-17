

const express = require("express");
const router = express.Router({ mergeParams: true }); 

const app = express();
const ListingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const cors = require("cors");

app.use(cors({
    origin: process.env.FRONTEND_URL, // Aapka Vite frontend URL
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/bookings", require("./routes/BookingRoutes"));
app.use("/history", require("./routes/HistoryRoutes"));



const cron = require('node-cron');
const Booking = require('./models/BookingModel');

// Runs every minute (* * * * *)
cron.schedule('* * * * *', async () => {
  try {
    // Find time 15 minutes ago
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Find bookings that are still pending and were created more than 15 mins ago
    const expiredBookings = await Booking.updateMany(
      { 
        status: "pending", 
        createdAt: { $lt: fifteenMinutesAgo } 
      },
      { 
        $set: { 
          status: "cancelled", 
          paymentStatus: "failed" 
        } 
      }
    );

    if (expiredBookings.modifiedCount > 0) {
      console.log(`[Cron] Cancelled ${expiredBookings.modifiedCount} expired pending bookings.`);
    }
  } catch (error) {
    console.error("[Cron Error] Failed to process expired bookings:", error);
  }
});

console.log('⏳ Booking Expiry Cron Job initialized.');




module.exports = app;
