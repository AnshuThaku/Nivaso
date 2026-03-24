const transporter = require("../config/mailConfig");

module.exports.sendPasswordResetEmail = async (email, username, resetURL) => {
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Nivaso - Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e11d48;">Nivaso</h2>
                <h3>Hello ${username},</h3>
                <p>You requested a password reset for your account. Click the button below to set a new password:</p>
                <a href="${resetURL}" style="display:inline-block; padding:12px 24px; background-color:#e11d48; color:white; text-decoration:none; border-radius:8px; font-weight: bold; margin: 15px 0;">Reset Password</a>
                <p style="color: #555;">If you didn't request this, please ignore this email. This secure link will expire in 15 minutes.</p>
            </div>
        `
    };

    // Yahan se mail send hoga
    return transporter.sendMail(mailOptions);
};