const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // Use Gmail App Password
    }
  });
};

const sendVerificationEmail = async (email, fullName, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Manthra Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✨ Verify Your Manthra Beauty Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2a1a0a); padding: 40px; text-align: center; border-bottom: 1px solid #c9a96e33; }
          .logo { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #c9a96e; text-transform: uppercase; }
          .tagline { font-size: 12px; letter-spacing: 3px; color: #888; margin-top: 6px; text-transform: uppercase; }
          .body { padding: 40px; }
          h2 { color: #c9a96e; font-size: 22px; font-weight: 600; margin-bottom: 16px; }
          p { color: #aaa; line-height: 1.7; margin-bottom: 16px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #c9a96e, #a0824e); color: #000; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 16px 36px; border-radius: 50px; text-decoration: none; margin: 20px 0; }
          .note { font-size: 12px; color: #555; margin-top: 24px; padding-top: 24px; border-top: 1px solid #222; }
          .footer { background: #0a0a0a; padding: 24px; text-align: center; color: #444; font-size: 12px; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MANTHRA</div>
            <div class="tagline">Beauty Lounge & Makeover Studio</div>
          </div>
          <div class="body">
            <h2>Welcome, ${fullName}! 🌸</h2>
            <p>Thank you for joining Manthra Beauty. You're just one step away from booking your first luxury beauty experience.</p>
            <p>Click the button below to verify your email address:</p>
            <div style="text-align:center">
              <a href="${verifyUrl}" class="btn">Verify My Account</a>
            </div>
            <p>This link will expire in <strong style="color:#c9a96e">24 hours</strong>.</p>
            <div class="note">
              If you didn't create an account, please ignore this email. The link above is: <br/>
              <span style="color:#666; word-break:break-all">${verifyUrl}</span>
            </div>
          </div>
          <div class="footer">© 2026 Manthra Beauty Lounge. All rights reserved.</div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendBookingConfirmation = async (email, fullName, booking) => {
  const transporter = createTransporter();
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const mailOptions = {
    from: `"Manthra Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Booking Confirmed — ${booking.service}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2a1a0a); padding: 40px; text-align: center; border-bottom: 1px solid #c9a96e33; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: 8px; color: #c9a96e; text-transform: uppercase; }
          .body { padding: 40px; }
          .card { background: #1a1a1a; border: 1px solid #c9a96e33; border-radius: 12px; padding: 24px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; }
          .label { color: #666; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
          .value { color: #fff; font-weight: 600; }
          .price { color: #c9a96e; font-size: 20px; font-weight: 700; }
          .footer { background: #0a0a0a; padding: 24px; text-align: center; color: #444; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MANTHRA</div>
          </div>
          <div class="body">
            <h2 style="color:#c9a96e">Booking Confirmed! 🎉</h2>
            <p style="color:#aaa">Hi ${fullName}, your appointment has been successfully booked.</p>
            <div class="card">
              <div class="row"><span class="label">Service</span><span class="value">${booking.service}</span></div>
              <div class="row"><span class="label">Category</span><span class="value">${booking.category}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${dateStr}</span></div>
              <div class="row"><span class="label">Time</span><span class="value">${booking.timeSlot}</span></div>
              <div class="row" style="border:none"><span class="label">Price</span><span class="price">₹${booking.price}</span></div>
            </div>
            <p style="color:#aaa">We look forward to seeing you! Please arrive 5 minutes early.</p>
          </div>
          <div class="footer">© 2026 Manthra Beauty Lounge. All rights reserved.</div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendBookingConfirmation };
