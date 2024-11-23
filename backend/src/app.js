const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./controllers/authenticationController');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/employee', authenticateToken.authenticateToken, employeeRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;