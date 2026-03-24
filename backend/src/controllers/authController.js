const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendWelcomeEmail = require("../services/emailService");
const bcrypt = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");
const crypto = require("crypto");
const {sendPasswordResetEmail} = require("../services/ForgetPasswordEmail");

// 🔥 Reusable Cookie Options (Code clean rakhne ke liye)
const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true,      // Production (HTTPS) mein mandatory
    sameSite: "none",  // Cross-domain (Vercel to Render) ke liye mandatory
};

module.exports.signup = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        // ✅ FIX 1: Number pehle, Message baad mein
        throw new ExpressError(400, "Email, username and password are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ExpressError(400, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOptions);
    
    sendWelcomeEmail(email, username).catch(err => {
        console.error("Nodemailer Error (Silent):", err.message);
    });    
    
    res.json({
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        },
        token
    });
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new ExpressError(400, "Email and password are required");
    }
    
    const user = await User.findOne({ email });
    if (!user) {
        // ✅ FIX 1: Number pehle, Message baad mein
        throw new ExpressError(401, "Invalid email or password");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ExpressError(401, "Invalid email or password");
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOptions);   
    
    res.json({
        user: {
            _id: user._id,
            email: user.email,  
            username: user.username
        },
        token
    });
};

module.exports.logout = (req, res) => {
    // ✅ FIX 2: clearCookie mein options pass karna zaroori hai!
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out successfully" });
};


// ... (baaki signup/login waisa hi rahega) ...

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ExpressError(400, "Please provide an email address.");

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;

    try {
        // 🔥 AB CODE EKDUM CLEAN HAI! Seedha function call.
        await sendPasswordResetEmail(user.email, user.username, resetURL);
        
        res.json({ message: "Password reset link sent to your email." });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        console.error("Email send error:", error);
        throw new ExpressError(500, "Failed to send email. Please try again later.");
    }
};

// controllers/user.js (ya authController.js) ke sabse niche
module.exports.resetPassword = async (req, res) => {
    const { token } = req.params; // URL se token nikalenge
    const { newPassword } = req.body; // Frontend se naya password aayega

    // 1. Dhoondo ki kya ye token kisi user ka hai, aur kya wo abhi valid hai (15 min se pehle)
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // $gt matlab "greater than current time"
    });

    if (!user) {
        throw new ExpressError(400, "Password reset token is invalid or has expired.");
    }

    // 2. Agar sab theek hai, toh naye password ko hash (encrypt) karo
    user.password = await bcrypt.hash(newPassword, 12);

    // 3. Purane tokens ko delete kar do taaki koi dobara use na kar sake
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been successfully reset. You can now log in." });
};