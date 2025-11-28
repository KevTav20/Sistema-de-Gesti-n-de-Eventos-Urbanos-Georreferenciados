const express = require('express');
const router = express.Router();
const polygonService = require('../services/polygon.service');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const polygon = await polygonService.createPolygon(req.body, req.user._id);
    res.status(201).json({
      success: true,
      data: polygon
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const polygons = await polygonService.getAllPolygons(req.user._id);
    res.status(200).json({
      success: true,
      data: polygons
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const polygon = await polygonService.getPolygonById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: polygon
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const polygon = await polygonService.updatePolygon(req.params.id, req.body, req.user._id);
    res.status(200).json({
      success: true,
      data: polygon
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await polygonService.deletePolygon(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

