const mongoose = require('mongoose');

const polygonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Polygon name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coordinates: [{
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Polygon', polygonSchema);

