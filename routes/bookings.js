const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const { sendBookingConfirmation, sendSalonNotification } = require('../utils/email');

// GET /api/bookings/slots?date=2026-04-20
// Returns booked slots for a given date
router.get('/slots', protect, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const bookedSlots = bookings.map(b => b.timeSlot);
    res.json({ bookedSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bookings — create a booking
router.post('/', protect, async (req, res) => {
  try {
    const { service, category, price, date, timeSlot, notes } = req.body;

    if (!service || !category || !price || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if slot is already taken
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Booking.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    const booking = new Booking({
      user: req.user._id,
      service,
      category,
      price,
      date: new Date(date),
      timeSlot,
      notes: notes || ''
    });

    await booking.save();

    // Send confirmation email
    try {
      await sendBookingConfirmation(req.user.email, req.user.fullName, booking);
    } catch (emailErr) {
      console.error('Booking email failed:', emailErr);
    }
     try {
     await sendSalonNotification(req.user.fullName, req.user.phone, booking);
    } catch (notifyErr) {
      console.error('Salon notification email failed:', notifyErr);
    }

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This time slot is already booked.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/my — get user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(20);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/bookings/:id — cancel a booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const now = new Date();
    const bookingDate = new Date(booking.date);
    const hoursUntil = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursUntil < 2) {
      return res.status(400).json({ message: 'Cannot cancel within 2 hours of appointment' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
