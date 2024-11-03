const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;