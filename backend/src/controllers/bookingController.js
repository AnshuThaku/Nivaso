const mongoose = require('mongoose');
const crypto = require('crypto');
const Booking = require('../models/BookingModel');
const Listing = require('../models/listing');
const razorpay = require('../config/RazorPayConfig');
const ExpressError = require('../utils/ExpressError');

// ── API 1: INITIATE BOOKING (Transaction + Razorpay Order) ──
exports.initiateBooking = async (req, res) => {
  const { listingId, checkIn, checkOut, guests, idempotencyKey } = req.body;
  const userId = req.user._id;

  // Step 1: Validate Dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (checkInDate < now) throw new ExpressError(400, "Check-in cannot be in the past");
  if (checkInDate >= checkOutDate) throw new ExpressError(400, "Check-out must be after check-in");

  // Step 2: Idempotency Check
  let existingBooking = await Booking.findOne({ idempotencyKey });
  if (existingBooking) {
    return res.status(200).json({ 
      success: true, 
      message: "Booking already initiated",
      booking: existingBooking,
      razorpayOrderId: existingBooking.razorpayOrderId
    });
  }

  // Step 3: Start MongoDB Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const listing = await Listing.findById(listingId).session(session);
    if (!listing) throw new ExpressError(404, "Listing not found");

    // Step 4: Availability Check (Overlap Logic)
    // Checks if ANY confirmed booking exists that overlaps with requested dates
    const overlappingBooking = await Booking.findOne({
      listing: listingId,
      status: "confirmed",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    }).session(session);

    if (overlappingBooking) {
      throw new ExpressError(409, "Room is not available for these dates");
    }

    // Step 5: Price Calculation
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
    const totalPrice = nights * listing.price;

    // Step 6: Create Booking (Status = Pending)
    const [newBooking] = await Booking.create([{
      user: userId,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      guests,
      idempotencyKey,
      status: "pending",
      paymentStatus: "pending"
    }], { session });

    // Step 7: Create Razorpay Order
    const options = {
      amount: Math.round(totalPrice * 100), // Razorpay accepts paise
      currency: "INR",
      receipt: newBooking._id.toString()
    };
    
    const rzpOrder = await razorpay.orders.create(options);

    // Store Razorpay Order ID in booking
    newBooking.razorpayOrderId = rzpOrder.id;
    await newBooking.save({ session });

    // Step 8: Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // Step 9: Return Response for Frontend Checkout
    res.status(201).json({
      success: true,
      booking: newBooking,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ── API 2: VERIFY PAYMENT ──
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // Step 1: Find the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ExpressError(404, "Booking not found");

  // Step 2: Verify Signature (Crucial for security)
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Step 3: Payment Valid -> Confirm Booking
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    res.status(200).json({ success: true, message: "Booking confirmed!", booking });
  } else {
    // Payment Tampered / Failed
    booking.status = "cancelled";
    booking.paymentStatus = "failed";
    await booking.save();

    throw new ExpressError(400, "Payment verification failed. Booking cancelled.");
  }
};

// ── API 3: GET MY BOOKINGS ──
exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('listing', 'title location image price')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
};

// ── API 4: CANCEL BOOKING ──
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  
  // Note: Only cancelling confirmed/pending bookings. In real world, add Razorpay Refund logic here.
  const booking = await Booking.findOneAndUpdate(
    { _id: id, user: req.user._id, status: { $ne: "cancelled" } },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) throw new ExpressError(404, "Booking not found or already cancelled");

  res.status(200).json({ success: true, message: "Booking cancelled successfully" });
};