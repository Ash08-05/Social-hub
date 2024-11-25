const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user data route
router.post('/update', async (req, res) => {
  const { username, twitter, instagram, linkedin, uniqueNumber } = req.body;
  try {
    const [rows] = await db.query('UPDATE users SET twitter = ?, instagram = ?, linkedin = ?, uniqueNumber = ? WHERE username = ?', [twitter, instagram, linkedin, uniqueNumber, username]);
    if (rows.affectedRows > 0) {
      res.status(200).json({ message: 'User data updated successfully' });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
