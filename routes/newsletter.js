const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const { subscribe, remove, index } = require("../controllers/newsletter");

router.get("/", isAdmin, asyncErrorHandler(index));
router.post("/", asyncErrorHandler(subscribe));
router.delete("/:id", isAdmin, asyncErrorHandler(remove));

module.exports = router;
