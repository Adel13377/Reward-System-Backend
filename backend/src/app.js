const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/userRoutes');
const http = require('http');
const authenticateToken = require('./controllers/authenticationController');
const empappRoutes = require('../employeeapp/routes/empapproutes');
const OfferRoutes = require('./routes/offerRoutes');
const path = require('path');
const superadminRoutes = require('./routes/superAdminRoutes');
const thirdPartyRoutes = require('../employeeapp/routes/thirdPartyRoutes');
const socketIo = require('socket.io');
const getofferstransactions = require('../employeeapp/routes/test');
const AIAssistantRoutes = require('../employeeapp/routes/AIAssistantRoutes');


// Connect to database
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/third', express.static(path.join(__dirname, 'third')));

// Routes
app.use('/employee', authenticateToken.authenticateToken, employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/employee-app',authenticateToken.authenticateToken, empappRoutes);
app.use('/superadmin', authenticateToken.authenticateToken, superadminRoutes); 
app.use('/api/offers', authenticateToken.authenticateToken, OfferRoutes);
app.use('/thirdparty', authenticateToken.authenticateToken, thirdPartyRoutes);
app.use('/test', getofferstransactions);
app.use('/api', AIAssistantRoutes);


// Error handling
app.use(errorHandler);

module.exports = app;