

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
  origin: process.env.FRONTEND_URL, // Render/Vercel ka link jo aap baad mein .env mein dalenge
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);




module.exports = app;
