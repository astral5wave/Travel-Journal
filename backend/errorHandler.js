const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message); // Log the error
  next(); // Pass control to the next middleware (prevents crashing)
};

module.exports = errorHandler;