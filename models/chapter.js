const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2 },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

module.exports = new mongoose.model("Chapter", chapterSchema);
