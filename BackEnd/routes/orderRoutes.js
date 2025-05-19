const express = require('express');
const router = express.Router();
const Order = require('../model/order');


// Get orders by user ID
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



router.delete('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

module.exports = router;
