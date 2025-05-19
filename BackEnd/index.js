const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadroutes');
// const orderRoutes = require('./routes/orderRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cart = require('./routes/updatecart');
const updateCartRoute = require('./routes/updatecart');
const payment=require('./routes/payment')


const path = require('path');
require('dotenv').config(); 

const app = express();


// Middleware
app.use(express.json()); 
app.use(cors()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/uploads', cartRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api', orderRoutes);
app.use('/api/updatecart', updateCartRoute);
app.use('/api/user', userRoutes); 
app.use('/api/order', orderRoutes); 
app.use('/api',payment)






// Connect to MongoDB
mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start se
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
