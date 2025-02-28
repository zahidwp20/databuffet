const { asyncErrorHandler } = require("./errorMiddleware");

const isLoggedIn = asyncErrorHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, please login to continue");
  }
});
const isAdmin = asyncErrorHandler(async (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized, Forbidden.");
  }
});

module.exports = { isLoggedIn, isAdmin };
