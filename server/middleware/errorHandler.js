const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Unique constraint error',
      details: 'This value already exists'
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler; 