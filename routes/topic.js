const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const { create } = require("../controllers/topic");

router.post("/", isAdmin, asyncErrorHandler(create));

module.exports = router;
