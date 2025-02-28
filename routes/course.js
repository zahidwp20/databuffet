const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const { create, index, view, edit, remove, update } = require("../controllers/course");

/* GET home page. */
router.get("/free-courses/", asyncErrorHandler(index));
router.post("/courses/", isAdmin, asyncErrorHandler(create));
router.get("/free-courses/:id", asyncErrorHandler(view));
router.put("/courses/:id", isAdmin, asyncErrorHandler(update));
router.delete("/courses/:id", isAdmin, asyncErrorHandler(remove));

module.exports = router;
