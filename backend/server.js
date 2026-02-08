const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "LOADED" : "NOT FOUND");

const resumeRoutes = require('./routes/resume');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;


/*
==================================================
✅ BULLETPROOF CORS (WORKS FOR VERCEL + RENDER)
==================================================
Allow EVERYTHING
No origin checks
No config mistakes
No deployment issues
==================================================
*/
app.use(cors());
app.options('*', cors());
/*
==================================================
*/


// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// Optional DB
if (process.env.MONGODB_URI) {
  connectDB();
}


// Routes
app.use('/api', resumeRoutes);


// Health
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ATS Resume Checker API running'
  });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || 'Server error'
  });
});


// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});


// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
