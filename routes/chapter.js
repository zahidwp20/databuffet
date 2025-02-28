const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const { create, remove, update } = require("../controllers/chapter");

router.post("/", isAdmin, asyncErrorHandler(create));
router.put("/:id", isAdmin, asyncErrorHandler(update));
router.delete("/:id", isAdmin, asyncErrorHandler(remove));

module.exports = router;
