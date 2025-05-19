const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: Object,
  paymentMethod: String,
  cartItems: Array,
  total: Number,
  tax: Number,
  grandTotal: Number,
  isPaid: Boolean,
  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
    method: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ This line prevents the OverwriteModelError:
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
