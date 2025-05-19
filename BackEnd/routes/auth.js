const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const protect=require('.././middleware/userauth')
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { username, email, phone, address, password } = req.body;

 

  if (!username || !email || !phone || !address || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, email, phone, address, password });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});


router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params._id;
    console.log('Deleting user with ID:', userId);
    const deletedUser = await User.findByIdAndDelete({userId:User._id});
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err); 
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});


// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);

  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token, user });



  // user
  router.get('/user', protect, (req, res) => {
    res.json(req.user);
  });
});
module.exports = router;
