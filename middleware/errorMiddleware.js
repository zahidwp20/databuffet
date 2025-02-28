const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ success: false, message: err.message });
};
module.exports = { asyncErrorHandler, errorHandler };
