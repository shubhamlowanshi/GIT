const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'successful', 'failed'], required: true },
  grandTotal: Number,
  address: {
    street: String,
    city: String,
    state: String,
    mobile: String,
  },
  
  cartItems: [
    {
      name: String,
      price: Number,
      qty: Number,
      image: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Orderhistory = mongoose.model('Orderhistory', orderSchema);

module.exports = Orderhistory;
