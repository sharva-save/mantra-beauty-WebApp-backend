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
const sendSalonNotification = async (customerName, customerPhone, booking) => {
  const transporter = createTransporter();
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"Manthra Beauty Bookings" <${process.env.EMAIL_USER}>`,
    to: 'sharvasave2509@gmail.com',
    subject: `🔔 New Appointment — ${customerName} | ${booking.service}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2a1a0a); padding: 32px 40px; border-bottom: 1px solid #c9a96e33; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: 8px; color: #c9a96e; text-transform: uppercase; }
          .badge { display: inline-block; background: #c9a96e22; border: 1px solid #c9a96e55; color: #c9a96e; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-top: 10px; }
          .body { padding: 36px 40px; }
          h2 { color: #fff; font-size: 20px; margin: 0 0 6px 0; }
          .sub { color: #666; font-size: 13px; margin-bottom: 28px; }
          .card { background: #1a1a1a; border: 1px solid #c9a96e33; border-radius: 12px; padding: 8px 0; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid #222; }
          .row:last-child { border-bottom: none; }
          .label { color: #555; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; }
          .value { color: #fff; font-weight: 600; font-size: 14px; }
          .highlight { color: #c9a96e; font-weight: 700; font-size: 16px; }
          .phone-link { color: #c9a96e; text-decoration: none; font-weight: 600; }
          .footer { background: #0a0a0a; padding: 20px; text-align: center; color: #333; font-size: 11px; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MANTHRA</div>
            <div class="badge">🔔 New Booking Alert</div>
          </div>
          <div class="body">
            <h2>New Appointment Booked</h2>
            <p class="sub">A customer just confirmed a time slot. Here are the details:</p>

            <div class="card">
              <div class="row">
                <span class="label">Customer Name</span>
                <span class="highlight">${customerName}</span>
              </div>
              <div class="row">
                <span class="label">Phone Number</span>
                <a href="tel:${customerPhone}" class="phone-link">${customerPhone || 'Not provided'}</a>
              </div>
              <div class="row">
                <span class="label">Service</span>
                <span class="value">${booking.service}</span>
              </div>
              <div class="row">
                <span class="label">Category</span>
                <span class="value">${booking.category}</span>
              </div>
              <div class="row">
                <span class="label">Date</span>
                <span class="value">${dateStr}</span>
              </div>
              <div class="row">
                <span class="label">Time Slot</span>
                <span class="highlight">${booking.timeSlot}</span>
              </div>
              <div class="row">
                <span class="label">Price</span>
                <span class="highlight">₹${booking.price}</span>
              </div>
              ${booking.notes ? `
              <div class="row">
                <span class="label">Notes</span>
                <span class="value" style="max-width:60%;text-align:right">${booking.notes}</span>
              </div>` : ''}
            </div>
          </div>
          <div class="footer">© 2026 Manthra Beauty Lounge — Internal Notification</div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendCancellationConfirmation = async (email, fullName, booking) => {
  const transporter = createTransporter();
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"Manthra Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `❌ Booking Cancelled — ${booking.service}`,
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
          .card { background: #1a1a1a; border: 1px solid #e05c5c33; border-radius: 12px; padding: 24px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; }
          .row:last-child { border-bottom: none; }
          .label { color: #666; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
          .value { color: #fff; font-weight: 600; }
          .footer { background: #0a0a0a; padding: 24px; text-align: center; color: #444; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MANTHRA</div>
          </div>
          <div class="body">
            <h2 style="color:#e05c5c">Booking Cancelled</h2>
            <p style="color:#aaa">Hi ${fullName}, your appointment has been cancelled as requested.</p>
            <div class="card">
              <div class="row"><span class="label">Service</span><span class="value">${booking.service}</span></div>
              <div class="row"><span class="label">Category</span><span class="value">${booking.category}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${dateStr}</span></div>
              <div class="row"><span class="label">Time</span><span class="value">${booking.timeSlot}</span></div>
              <div class="row"><span class="label">Price</span><span class="value">₹${booking.price}</span></div>
            </div>
            <p style="color:#aaa">We hope to see you again soon. Feel free to rebook anytime.</p>
          </div>
          <div class="footer">© 2026 Manthra Beauty Lounge. All rights reserved.</div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendSalonCancellationNotification = async (customerName, customerPhone, booking) => {
  const transporter = createTransporter();
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"Manthra Beauty Bookings" <${process.env.EMAIL_USER}>`,
    to: 'sharvasave2509@gmail.com',
    subject: `❌ Booking Cancelled — ${customerName} | ${booking.service}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2a1a0a); padding: 32px 40px; border-bottom: 1px solid #e05c5c33; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: 8px; color: #c9a96e; text-transform: uppercase; }
          .badge { display: inline-block; background: #e05c5c22; border: 1px solid #e05c5c55; color: #e05c5c; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-top: 10px; }
          .body { padding: 36px 40px; }
          h2 { color: #fff; font-size: 20px; margin: 0 0 6px 0; }
          .sub { color: #666; font-size: 13px; margin-bottom: 28px; }
          .card { background: #1a1a1a; border: 1px solid #e05c5c33; border-radius: 12px; padding: 8px 0; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid #222; }
          .row:last-child { border-bottom: none; }
          .label { color: #555; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; }
          .value { color: #fff; font-weight: 600; font-size: 14px; }
          .highlight { color: #e05c5c; font-weight: 700; font-size: 16px; }
          .phone-link { color: #c9a96e; text-decoration: none; font-weight: 600; }
          .footer { background: #0a0a0a; padding: 20px; text-align: center; color: #333; font-size: 11px; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MANTHRA</div>
            <div class="badge">❌ Cancellation Alert</div>
          </div>
          <div class="body">
            <h2>Appointment Cancelled</h2>
            <p class="sub">A customer has cancelled their booking. Slot is now available.</p>
            <div class="card">
              <div class="row">
                <span class="label">Customer Name</span>
                <span class="highlight">${customerName}</span>
              </div>
              <div class="row">
                <span class="label">Phone Number</span>
                <a href="tel:${customerPhone}" class="phone-link">${customerPhone || 'Not provided'}</a>
              </div>
              <div class="row">
                <span class="label">Service</span>
                <span class="value">${booking.service}</span>
              </div>
              <div class="row">
                <span class="label">Category</span>
                <span class="value">${booking.category}</span>
              </div>
              <div class="row">
                <span class="label">Date</span>
                <span class="value">${dateStr}</span>
              </div>
              <div class="row">
                <span class="label">Time Slot</span>
                <span class="highlight">${booking.timeSlot}</span>
              </div>
              <div class="row">
                <span class="label">Price</span>
                <span class="value">₹${booking.price}</span>
              </div>
            </div>
          </div>
          <div class="footer">© 2026 Manthra Beauty Lounge — Internal Notification</div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendBookingConfirmation, sendSalonNotification,  sendCancellationConfirmation,        
  sendSalonCancellationNotification     };
