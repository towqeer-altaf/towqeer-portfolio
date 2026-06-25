require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import Routers
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Import DB Connection function
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Security and Request Parsing Middleware
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets (Uploads directory made public)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Hookup
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/profile', profileRoutes);

// Start Database first, then spin up the Express server
const startServer = async () => {
  try {
    // 1. Establish database pool
    await connectDB();
    
    // 2. Start listening for API requests
    app.listen(PORT, () => console.log(`🚀 Server operating on port ${PORT}`));
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();