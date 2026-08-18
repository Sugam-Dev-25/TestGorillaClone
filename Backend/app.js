require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./app/config/db');

const authRoutes = require('./app/routes/authRoutes');
const candidateRoutes = require('./app/routes/candidateRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const recruiterRoutes = require('./app/routes/recruiterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite Dev Server URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Base API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiter', recruiterRoutes);

// Default Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'SkillAssess API Backend is Running' });
});

// Connect DB & Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running on http://localhost:${PORT}`);
    });
});