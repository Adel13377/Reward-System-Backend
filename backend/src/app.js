const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./controllers/authenticationController');
const empappRoutes = require('../employeeapp/routes/empapproutes');
const app = express();
const OfferRoutes = require('./routes/offerRoutes');
const path = require('path');

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/employee', authenticateToken.authenticateToken, employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/employee-app', empappRoutes); 
app.use('/api/offers', OfferRoutes);
// Error handling
app.use(errorHandler);

module.exports = app;