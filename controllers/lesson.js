const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const isValidObjectId = require("../utils/ObjectIdValidator");
const fs = require("fs");
const { cloudinary, deleteByTag } = require("../config/cloudinary");

module.exports = {
  async create(req, res, next) {
    const { title, chapter } = req.body;
    const foundChapter = await Chapter.findOne({ _id: chapter });
    const lesson = new Lesson({
      title,
      chapter,
      course: foundChapter.course,
    });
    await lesson.save();
    foundChapter.lessons.push(lesson);
    await foundChapter.save();
    req.session.success = "Lesson added successfully.";
    return res.redirect("/lessons/" + lesson._id + "/edit");
  },

  async view(req, res, next) {
    const { id } = req.params;
    const isId = isValidObjectId(id);
    const dbQuery = isId ? { _id: id } : { slug: id };
    const lesson = await Lesson.findOne(dbQuery).populate("course chapter", "title").lean();
    const chapters = await Chapter.find({ course: lesson.course }).populate("lessons", "title slug").lean();

    const currentChapterIndex = chapters.findIndex((c) => c._id.equals(lesson.chapter._id));
    const currentChapter = chapters[currentChapterIndex];
    const currentLessonIndex = chapters[currentChapterIndex].lessons.findIndex((l) => l._id.equals(lesson._id));

    let nextLesson;
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      nextLesson = currentChapter.lessons[currentLessonIndex + 1];
    } else if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      if (nextChapter.lessons) {
        nextLesson = nextChapter.lessons[0];
      }
    }

    let prevLesson;
    if (currentLessonIndex > 0) {
      prevLesson = currentChapter.lessons[currentLessonIndex - 1];
    } else if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      if (prevChapter.lessons) {
        prevLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
      }
    }

    return res.render("lesson/ViewPage", {
      lesson,
      chapters,
      nextLesson,
      prevLesson,
      metaTitle: lesson.title,
    });
  },

  async edit(req, res, next) {
    const { id } = req.params;
    const lesson = await Lesson.findOne({ _id: id }).lean();
    return res.render("lesson/EditPage", { lesson });
  },

  async update(req, res, next) {
    const { id } = req.params;
    const { title, body } = req.body;
    await Lesson.updateOne({ _id: id }, { title, body });
    return res.redirect("back");
  },

  async remove(req, res, next) {
    const { id } = req.params;
    await deleteByTag(id);
    const lesson = await Lesson.findOneAndDelete({ _id: id });
    await Chapter.updateOne({ _id: lesson.chapter }, { $pull: { lessons: lesson._id } });
    req.session.success = "Lesson deleted successfully.";
    return res.redirect("back");
  },

  async imageUpload(req, res, next) {
    const { lessonId, chapterId, courseId } = req.body;
    if (!lessonId || !chapterId || !courseId) {
      fs.unlink(req.file.path);
      throw new Error("lessonId, chapterId and courseId are required");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "databuffet/",
      tags: [lessonId, chapterId, courseId],
      width: 720,
      height: 720,
      crop: "limit",
    });
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.status(200).json({ url: result.secure_url });
  },
};
