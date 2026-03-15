

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
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);




module.exports = app;
