const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: String,
  price: String,
  imageUrl: String,
  qty: { type: Number, default: 1 }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
