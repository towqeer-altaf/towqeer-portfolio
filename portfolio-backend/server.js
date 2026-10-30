require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

// Import Routers
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Import DB Connection function
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Security and Request Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/public', express.static(path.join(__dirname, 'uploads', 'public'), {
  dotfiles: 'deny',
  index: false,
  maxAge: '1d'
}));
app.use('/uploads', mediaRoutes);

// Routes Hookup
app.use('/api/projects', projectRoutes);
app.use('/api/contact', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false
}), contactRoutes);
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false
}));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/certificates', certificateRoutes);

app.use((err, req, res, next) => {
  console.error('Request failed:', err.message);
  const status = err instanceof multer.MulterError ? 400 : (err.status || 500);
  res.status(status).json({ message: status === 500 ? 'An unexpected server error occurred.' : err.message });
});

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