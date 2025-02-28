const express = require("express");
const router = express.Router();
const { asyncErrorHandler } = require("../middleware/errorMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const { create, view, remove, edit, update, imageUpload } = require("../controllers/lesson");
const upload = require("../config/multer");

router.post("/", isAdmin, asyncErrorHandler(create));
router.get("/:id", asyncErrorHandler(view));
router.get("/:id/edit", isAdmin, asyncErrorHandler(edit));
router.put("/:id", isAdmin, asyncErrorHandler(update));
router.delete("/:id", isAdmin, asyncErrorHandler(remove));

router.post("/image", upload.single("image"), asyncErrorHandler(imageUpload));

module.exports = router;
