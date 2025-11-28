const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d'
  });
};

const register = async (userData) => {
  const { username, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  // Create new user
  const user = new User({ username, email, password });
  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    token
  };
};

const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    token
  };
};

module.exports = {
  register,
  login
};
