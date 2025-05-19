const express = require('express');
const Cart = require('../model/cart');
const User = require('../model/user');
const router = express.Router();


const protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Get Cart Items for the logged-in user
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  
  if (!cart) {
    return res.status(404).json({ message: 'Cart is empty' });
  }
  
  res.json(cart);
});

// Add Item to Cart
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user.userId });
  
  if (!cart) {
    cart = new Cart({ userId: req.user.userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
});

module.exports = router;
