const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validation/schemas');
const router = express.Router();
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { success } = registerSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { username, password, isAdmin } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password, isAdmin });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { success } = loginSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;