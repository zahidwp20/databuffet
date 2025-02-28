const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
module.exports = {
  async create(req, res, next) {
    const { title, course } = req.body;
    const chapter = new Chapter({ title, course });
    await chapter.save();
    await Course.updateOne({ _id: course }, { $push: { chapters: chapter._id } });
    req.session.success = "Chapter added successfully.";
    return res.redirect("back");
  },

  async update(req, res, next) {
    const { id } = req.params;
    const { title } = req.body;
    await Chapter.updateOne({ _id: id }, { title });
    req.session.success = "Chapter renamed successfully.";
    return res.redirect("back");
  },

  async remove(req, res, next) {
    const { id } = req.params;
    await deleteByTag(id);
    await Lesson.deleteMany({ chapter: id });
    const chapter = await Chapter.findOneAndDelete({ _id: id });
    await Course.updateOne({ _id: chapter.course }, { $pull: { chapters: chapter._id } });
    req.session.success = "Chapter deleted successfully.";
    return res.redirect("back");
  },
};
