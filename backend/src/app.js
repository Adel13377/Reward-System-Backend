const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/employee', authenticateToken, employeeRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use(errorHandler);


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// app.get('/posts/:id', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.params.id; // Get the user ID from the URL parameter
//         const userPosts = await Posts.find({ userId: userId }); // Fetch posts based on userId
//         if (!userPosts.length) {
//             return res.status(404).json({ message: 'No posts found for this user.' });
//         }
//         res.json(userPosts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while fetching posts.' });
//     }
// });

// app.get('/posts', authenticateToken, (req, res) => {
//     res.json(posts.filter(post => post.username === req.user.name));
//     // res.json(posts);
// });

module.exports = app;