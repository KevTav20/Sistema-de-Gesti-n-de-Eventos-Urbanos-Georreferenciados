const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth.routes');
const locationRoutes = require('./routes/location.routes');
const polygonRoutes = require('./routes/polygon.routes');
const categoryRoutes = require('./routes/category.routes');
const eventRoutes = require('./routes/event.routes');

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/polygons', polygonRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler.middleware');
app.use(errorHandler);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/geomap';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

