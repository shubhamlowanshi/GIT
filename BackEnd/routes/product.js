const express = require('express');
const router = express.Router();
const Product = require('../model/product');

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const product = new Product({ name, price, imageUrl, category, description });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
router.get('/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


module.exports = router;
