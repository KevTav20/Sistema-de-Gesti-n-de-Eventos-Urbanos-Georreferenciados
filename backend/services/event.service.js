const Event = require('../models/Event.model');

const createEvent = async (eventData, userId) => {
  const event = new Event({
    ...eventData,
    user: userId
  });
  await event.save();
  return await Event.findById(event._id).populate('location', 'name latitude longitude').populate('user', 'username');
};

const getAllEvents = async (userId) => {
  return await Event.find({ user: userId })
    .populate('location', 'name latitude longitude')
    .populate('user', 'username')
    .sort({ date: -1 });
};

const getEventById = async (eventId, userId) => {
  const event = await Event.findOne({ _id: eventId, user: userId })
    .populate('location', 'name latitude longitude')
    .populate('user', 'username');
  
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }
  
  return event;
};

const updateEvent = async (eventId, eventData, userId) => {
  const event = await Event.findOne({ _id: eventId, user: userId });
  
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  Object.assign(event, eventData);
  await event.save();
  
  return await Event.findById(event._id).populate('location', 'name latitude longitude').populate('user', 'username');
};

const deleteEvent = async (eventId, userId) => {
  const event = await Event.findOne({ _id: eventId, user: userId });
  
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  await Event.deleteOne({ _id: eventId });
  return { message: 'Event deleted successfully' };
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};

