const Booking = require("../models/BookingModel");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const WrapAsync = require("../utils/Wrapasync");

// 🔥 Nayi files import ki hain asli payment ke liye
const Razorpay = require("razorpay");
const crypto = require("crypto");

// 🔑 Razorpay Setup (.env se keys uthayega)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. CREATE PENDING BOOKING & GENERATE RAZORPAY ORDER
module.exports.createBooking = WrapAsync(async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    if (!checkIn || !checkOut || !guests) {
        throw new ExpressError(400, "Missing details.");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        throw new ExpressError(400, "Invalid dates. Check-out must be after Check-in.");
    }

    // 🛑 Double Booking Check
    const overlappingBookings = await Booking.find({
        listing: id,
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ],
        paymentStatus: { $ne: 'failed' } 
    });

    if (overlappingBookings.length > 0) {
        throw new ExpressError(400, "Sorry, these dates are already booked by someone else.");
    }

    // 💰 Price Calculation
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found.");
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const basePrice = nights * listing.price;
    const grandTotal = basePrice + Math.round(basePrice * 0.14) + Math.round(basePrice * 0.05);

    // 💾 Save Booking as Pending
    const newBooking = new Booking({
        user: req.user.id || req.user._id,
        listing: id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice: grandTotal,
        paymentStatus: 'pending' 
    });

    await newBooking.save();

    // 🚀 CREATE RAZORPAY ORDER (Naya asili logic)
    const options = {
        amount: grandTotal * 100, // Razorpay amount Paise (₹1 = 100 paise) mein leta hai
        currency: "INR",
        receipt: `receipt_${newBooking._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Database mein Order ID save kar do (Verificaton ke time kaam aayega)
    newBooking.razorpayOrderId = order.id;
    await newBooking.save();

    // Frontend ko 'order' bhejenge taaki asli popup khul sake
    res.status(201).json({ 
        success: true, 
        bookingId: newBooking._id, 
        order: order 
    });
});

// 2. VERIFY REAL PAYMENT (Hacker-Proof Validation)
module.exports.confirmPayment = WrapAsync(async (req, res) => {
    // Frontend se ab ye 4 cheezein aayengi!
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ExpressError(400, "Missing payment details.");
    }
    
    // 🛡️ SECURITY CHECK: Khudka Signature generate karo aur match karo
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        // Asli Payment Hai! Database mein status update karo
        await Booking.findByIdAndUpdate(bookingId, { 
            paymentStatus: 'paid',
            razorpayPaymentId: razorpay_payment_id 
        });
        
        res.status(200).json({ success: true, message: "Payment verified & Booking Confirmed!" });
    } else {
        // Fraud Payment!
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'failed' });
        throw new ExpressError(400, "Invalid payment signature. Fraud detected!");
    }
});