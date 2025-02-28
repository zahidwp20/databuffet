const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2 },
  slug: { type: String, slug: "title", unique: true },
  chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  body: { type: String },
});

module.exports = new mongoose.model("Lesson", lessonSchema);
