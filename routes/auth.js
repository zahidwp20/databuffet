const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const {
  login,
  logout,
  register,
  me,
  changePassword,
  forgotPassword,
  resetPassword,
  getLogin,
  getRegister,
} = require("../controllers/auth");
const router = express.Router();

router.get("/login", asyncErrorHandler(getLogin));
router.post("/login", asyncErrorHandler(login));
router.post("/logout", isLoggedIn, asyncErrorHandler(logout));
router.get("/signup", asyncErrorHandler(getRegister));
router.post("/signup", asyncErrorHandler(register));
router.put("/password", isLoggedIn, asyncErrorHandler(changePassword));
router.post("/password/forgot", asyncErrorHandler(forgotPassword));
router.post("/password/reset", asyncErrorHandler(resetPassword));
router.get("/me", isLoggedIn, asyncErrorHandler(me));

module.exports = router;
