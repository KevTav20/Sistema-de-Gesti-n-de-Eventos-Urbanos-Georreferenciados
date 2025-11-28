const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      error: 'This record already exists'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Mostrar detalles del error solo en desarrollo
  const isDevelopment = true; // Cambiar a false en producción
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: isDevelopment ? err.stack : undefined
  });
};

module.exports = errorHandler;

