const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const Booking = require('../models/booking');

// Show UPI payment page with app selection
router.get('/upi', isAuth, (req, res) => {
  const { amount, bookingId } = req.query;
  res.render('payment/upi-payment', {
    pageTitle: 'UPI Payment',
    amount,
    bookingId,
    currentPage: 'payment'
  });
});

// Process UPI payment
router.post('/process-upi', isAuth, async (req, res) => {
  try {
    const { bookingId, amount, upiId, upiApp } = req.body;
    
    // Here you would typically integrate with a real payment gateway
    // For demo purposes, we'll simulate a successful payment 90% of the time
    const isSuccessful = Math.random() < 0.9;

    if (isSuccessful) {
      // Generate a random transaction ID
      const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
      
      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, { 
        paymentStatus: 'completed',
        transactionId,
        paymentMethod: 'upi',
        upiDetails: { upiId, upiApp }
      });

      res.render('payment/success', {
        pageTitle: 'Payment Successful',
        currentPage: 'payment',
        transactionId,
        amount,
        upiApp
      });
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  } catch (error) {
    res.render('payment/failure', {
      pageTitle: 'Payment Failed',
      currentPage: 'payment',
      error: error.message
    });
  }
});

module.exports = router; 