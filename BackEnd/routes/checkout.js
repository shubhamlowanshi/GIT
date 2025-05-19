const express = require('express');
const router = express.Router();
const Order = require('../model/order');

router.post('/checkout', async (req, res) => {
  try {
    const { user, address, paymentMethod, cartItems, total, tax, grandTotal } = req.body;

    if (!user || !address || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newOrder = new Order({
      user,
      address,
      paymentMethod,
      cartItems,
      total,
      tax,
      grandTotal
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
