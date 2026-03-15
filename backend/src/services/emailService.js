const transporter = require('../config/mailConfig');

const sendWelcomeEmail = async (userEmail, userName) => {
  await transporter.sendMail({
    // 🔥 Branding Change: Wanderlust to Nivaso
    from: `"Nivaso Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to Nivaso - Your Journey Begins Here',
    html: `
      <div style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                
                {/* --- Header Section --- */}
                <tr>
                  <td style="background:#000000;padding:40px;text-align:center;color:#ffffff;border-bottom: 4px solid #F43F5E;">
                    <h2 style="margin:0; font-family: 'Georgia', serif; font-size: 32px; color: #F43F5E; letter-spacing: 2px;">NIVASO</h2>
                    <p style="margin:10px 0 0;font-size:14px; letter-spacing: 3px; text-transform: uppercase; color: #cccccc;">Find Your Perfect Stay</p>
                  </td>
                </tr>
                
                {/* --- Content Section --- */}
                <tr>
                  <td style="padding:40px;color:#333333;line-height:1.8;">
                    <p style="font-size:18px;margin-bottom:20px;">
                      Dear <strong>${userName}</strong>,
                    </p>
                    <p style="font-size:16px;">
                      Welcome to <strong>Nivaso</strong>! We're excited to have you as part of our community. Your account is now active and ready for exploration.
                    </p>
                    <p style="font-size:16px;">
                      From cozy cottages to luxury villas, discover a space that feels like home, anywhere in the world. Log in now to start your next adventure.
                    </p>
                    
                    {/* --- Personal Branding Box --- */}
                    <div style="background:#FFF1F2; border-left:4px solid #F43F5E; padding:20px; margin:35px 0; border-radius:4px;">
                      <p style="margin:0; font-size:14px; color:#444; font-style: italic;">
                        "Nivaso is built on the idea of seamless travel and authentic stays. This platform was proudly designed and developed by <strong>Anshu Thakur</strong>."
                      </p>
                    </div>

                    <p style="margin-top:30px; font-size:16px;">
                      Best Regards,<br/>
                      <span style="color: #F43F5E; font-weight: bold;">The Nivaso Team</span>
                    </p>
                  </td>
                </tr>
                
                {/* --- Footer Section --- */}
                <tr>
                  <td style="background:#111111;padding:25px;text-align:center;font-size:12px;color:#999999;">
                    <p style="margin: 0 0 10px 0;">Follow us for travel inspiration</p>
                    <p style="margin: 0;">© ${new Date().getFullYear()} <strong>Nivaso</strong>. All Rights Reserved.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
  });
};

module.exports = sendWelcomeEmail;