

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
app.use("/listings/:id/bookings", require("./routes/BookingRoute"));






module.exports = app;
