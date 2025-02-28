const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { index, about, contact, careerCenter, privacy, terms } = require("../controllers");

/* GET home page. */
router.get("/", asyncErrorHandler(index));
router.get("/about", asyncErrorHandler(about));
router.get("/contact", asyncErrorHandler(contact));
router.get("/career-center", asyncErrorHandler(careerCenter));
router.get("/privacy-policy", asyncErrorHandler(privacy));
router.get("/terms-conditions", asyncErrorHandler(terms));

module.exports = router;
