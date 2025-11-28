const Polygon = require('../models/Polygon.model');

const createPolygon = async (polygonData, userId) => {
  const polygon = new Polygon({
    ...polygonData,
    user: userId
  });
  await polygon.save();
  return await Polygon.findById(polygon._id).populate('user', 'username');
};

const getAllPolygons = async (userId) => {
  return await Polygon.find({ user: userId })
    .populate('user', 'username')
    .sort({ createdAt: -1 });
};

const getPolygonById = async (polygonId, userId) => {
  const polygon = await Polygon.findOne({ _id: polygonId, user: userId })
    .populate('user', 'username');
  
  if (!polygon) {
    const error = new Error('Polygon not found');
    error.status = 404;
    throw error;
  }
  
  return polygon;
};

const updatePolygon = async (polygonId, polygonData, userId) => {
  const polygon = await Polygon.findOne({ _id: polygonId, user: userId });
  
  if (!polygon) {
    const error = new Error('Polygon not found');
    error.status = 404;
    throw error;
  }

  Object.assign(polygon, polygonData);
  await polygon.save();
  
  return await Polygon.findById(polygon._id).populate('user', 'username');
};

const deletePolygon = async (polygonId, userId) => {
  const polygon = await Polygon.findOne({ _id: polygonId, user: userId });
  
  if (!polygon) {
    const error = new Error('Polygon not found');
    error.status = 404;
    throw error;
  }

  await Polygon.deleteOne({ _id: polygonId });
  return { message: 'Polygon deleted successfully' };
};

module.exports = {
  createPolygon,
  getAllPolygons,
  getPolygonById,
  updatePolygon,
  deletePolygon
};

