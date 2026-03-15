const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendWelcomeEmail = require("../services/emailService");
const bcrypt = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");

module.exports.signup = async (req, res) => {
    const { email, password, username } = req.body;

    if(!email || !password || !username) {
        throw new ExpressError("Email, username and password are required", 400);
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ExpressError("Email already in use", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, );
    await sendWelcomeEmail(email, username);
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
    if(!email || !password) {
        throw new ExpressError("Email and password are required", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ExpressError("Invalid email or password", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ExpressError("Invalid email or password", 401);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// 🔥 SECURITY UPDATE: Cookie ko httpOnly banana zaroori hai
const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,      // Production mein true
    sameSite: "none",  // Cross-domain cookies ke liye mandatory hai
};
res.cookie("token", token, cookieOptions);   res.json({
    user: {
        _id: user._id,
        email: user.email,  
        username: user.username
    },
    token
   });
};



module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
 


