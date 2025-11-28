const express = require('express');
const router = express.Router();
const eventService = require('../services/event.service');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user._id);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents(req.user._id);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user._id);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

