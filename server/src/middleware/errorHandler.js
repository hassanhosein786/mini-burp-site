export const errorHandler = (error, _req, res, _next) => {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error"
  });
};
