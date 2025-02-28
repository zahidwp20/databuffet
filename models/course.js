const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2 },
  slug: { type: String, slug: "title", unique: true },
  description: { type: String },
  length: {
    value: { type: Number, required: true },
    unit: { type: String, require: true, enum: ["hours", "minutes"] },
  },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  difficulty: { type: String, require: true, enum: ["beginner", "intermediate", "advanced"] },
  type: { type: String, required: true, enum: ["course", "project"] },
  technology: { type: Schema.ObjectId, required: true, ref: "Technology" },
  topic: { type: Schema.ObjectId, required: true, ref: "Topic" },
  link: {
    title: { type: String, trim: true, minlength: 3 },
    url: { type: String, trim: true, minlength: 3 },
  },
});

module.exports = new mongoose.model("Course", courseSchema);
