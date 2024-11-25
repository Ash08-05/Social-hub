const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'social_hub'
});

// Register a new user
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
  const params = [username, password];

  console.log('Executing query:', sql);
  console.log('With parameters:', params);

  pool.query(sql, params, (error, results) => {
    if (error) {
      console.error('Database error:', error.sqlMessage || error);
      return res.status(500).json({ message: 'Error registering user', error: error.sqlMessage || error });
    }
    const userId = results.insertId;
    console.log('User registered successfully with ID:', userId);
    res.status(201).json({
      message: 'User registered successfully',
      user: { user_id: userId, username, qr_code_data: null, unique_number: null }
    });
  });
});
// Log in an existing user
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  const params = [username, password];

  console.log('Executing query:', sql);
  console.log('With parameters:', params);

  pool.query(sql, params, (error, results) => {
    if (error) {
      console.error('Database error:', error.sqlMessage || error);
      return res.status(500).json({ message: 'Error logging in', error: error.sqlMessage || error });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = results[0];
    res.status(200).json({ 
      user_id: user.user_id,
      username: user.username,
      qr_code_data: user.qr_code_data,
      unique_number: user.unique_number 
    });
  });
});
app.post('/generate-link', (req, res) => {
  const { username, twitter, instagram, linkedin } = req.body;

  // Create a single URL containing all social media links
  const combinedLink = `https://yoursite.com/user/${username}?twitter=${encodeURIComponent(twitter)}&instagram=${encodeURIComponent(instagram)}&linkedin=${encodeURIComponent(linkedin)}`;

  res.status(200).json({ combinedLink });
});

app.post('/get-link-by-unique', (req, res) => {
  const { uniqueNumber } = req.body;

  pool.query('SELECT username, twitter, instagram, linkedin FROM Users WHERE unique_number = ?', [uniqueNumber], (error, results) => {
    if (error) {
      console.error('Database error:', error.sqlMessage || error);
      return res.status(500).json({ message: 'Error retrieving data', error: error.sqlMessage || error });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No user found with the provided unique number' });
    }
    const user = results[0];
    const combinedLink = `https://yoursite.com/user/${user.username}?twitter=${encodeURIComponent(user.twitter)}&instagram=${encodeURIComponent(user.instagram)}&linkedin=${encodeURIComponent(user.linkedin)}`;

    res.status(200).json({ combinedLink });
  });
});




// Log a message to confirm connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database as ID ' + connection.threadId);
  connection.release();
});

// Update user information
app.post('/auth/update', (req, res) => {
  const { username, twitter, instagram, linkedin, uniqueNumber } = req.body;

  console.log('Received data for update:', req.body); // Log received data

  const sql = 'UPDATE Users SET twitter = ?, instagram = ?, linkedin = ?, unique_number = ? WHERE username = ?';
  const params = [twitter, instagram, linkedin, uniqueNumber, username];

  console.log('Executing query:', sql);
  console.log('With parameters:', params);

  pool.query(sql, params, (error, results) => {
    if (error) {
      console.error('Database error:', error.sqlMessage);
      return res.status(500).json({ message: 'Error updating user', error: error.sqlMessage });
    }
    console.log('Update successful, affected rows:', results.affectedRows); // Log the result

    // Additional check to ensure update was successful
    pool.query('SELECT * FROM Users WHERE username = ?', [username], (selectError, selectResults) => {
      if (selectError) {
        console.error('Database select error:', selectError.sqlMessage);
        return res.status(500).json({ message: 'Error verifying update', error: selectError.sqlMessage });
      }
      console.log('Updated user data:', selectResults);
      res.status(200).json({ message: 'User updated successfully', user: selectResults });
    });
  });
});

app.listen(3030, () => {
  console.log('Server running on http://localhost:3030');
});
