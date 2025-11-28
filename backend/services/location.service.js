const Location = require('../models/Location.model');

const createLocation = async (locationData, userId) => {
  const location = new Location({
    ...locationData,
    user: userId
  });
  await location.save();
  return await Location.findById(location._id).populate('category', 'name color').populate('user', 'username');
};

const getAllLocations = async (userId) => {
  return await Location.find({ user: userId })
    .populate('category', 'name color')
    .populate('user', 'username')
    .sort({ createdAt: -1 });
};

const getLocationById = async (locationId, userId) => {
  const location = await Location.findOne({ _id: locationId, user: userId })
    .populate('category', 'name color')
    .populate('user', 'username');
  
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }
  
  return location;
};

const updateLocation = async (locationId, locationData, userId) => {
  const location = await Location.findOne({ _id: locationId, user: userId });
  
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }

  Object.assign(location, locationData);
  await location.save();
  
  return await Location.findById(location._id).populate('category', 'name color').populate('user', 'username');
};

const deleteLocation = async (locationId, userId) => {
  const location = await Location.findOne({ _id: locationId, user: userId });
  
  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }

  await Location.deleteOne({ _id: locationId });
  return { message: 'Location deleted successfully' };
};

const searchLocationsByName = async (searchTerm, userId) => {
  const regex = new RegExp(searchTerm, 'i');
  return await Location.find({
    user: userId,
    name: { $regex: regex }
  })
    .populate('category', 'name color')
    .populate('user', 'username')
    .sort({ createdAt: -1 });
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  searchLocationsByName
};

