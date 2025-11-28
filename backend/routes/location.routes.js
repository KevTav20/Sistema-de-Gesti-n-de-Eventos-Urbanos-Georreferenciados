const express = require('express');
const router = express.Router();
const locationService = require('../services/location.service');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const location = await locationService.createLocation(req.body, req.user._id);
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const locations = await locationService.getAllLocations(req.user._id);
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    const locations = await locationService.searchLocationsByName(name, req.user._id);
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const location = await locationService.getLocationById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const location = await locationService.updateLocation(req.params.id, req.body, req.user._id);
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await locationService.deleteLocation(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

