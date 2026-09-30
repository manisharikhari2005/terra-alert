// module.exports = errorHandler;
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Invalid JSON error
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // Other unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
