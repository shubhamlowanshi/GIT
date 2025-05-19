const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require('../model/order'); // adjust the path if needed

require("dotenv").config()

// Initialize Razorpay once

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// const order = await razorpay.orders.create({
//   amount: 50000, // in paise
//   currency: 'INR',
//   receipt: 'receipt#1',
// });

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    // Basic validation
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Razorpay expects amount in paise (multiply by 100 if amount is in rupees)
    const options = {
      amount: Number(amount)*100, 
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: "Failed to create Razorpay order", details: err.message });
  }
});


// Get Payment Info
router.get('/payment/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency
    });
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

// Verify Payment Signature
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user,
    address,
    paymentMethod,
    cartItems,
    total,
    tax,
    grandTotal
  } = req.body;

  const hmac = crypto.createHmac('sha256', razorpay.key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }

  try {
    const newOrder = new Order({
      user,
      address,
      cartItems,
      paymentMethod,
      total,
      tax,
      grandTotal,
      isPaid: true,
      paidAt: new Date(),
      paymentInfo: {
        id: razorpay_payment_id,
        status: 'paid',
        method: 'razorpay'
      }
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Payment verified and order saved", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
