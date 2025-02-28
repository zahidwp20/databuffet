const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Technology = require("../models/technology");
const Topic = require("../models/topic");
const isValidObjectId = require("../utils/ObjectIdValidator");

module.exports = {
  async index(req, res, next) {
    const { type = "course", difficulty, technology, topic } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (technology) {
      query.technology = technology;
    }
    if (topic) {
      query.topic = topic;
    }
    const courses = await Course.find(query).populate("technology topic").lean();
    const technologies = await Technology.find().lean();
    const topics = await Topic.find().lean();
    return res.render("course/IndexPage", {
      courses,
      technologies,
      topics,
      filter: {
        type,
        difficulty,
        technology: Array.isArray(technology) ? technology : [technology],
        topic: Array.isArray(topic) ? topic : [topic],
      },
    });
  },

  async view(req, res, next) {
    const { id } = req.params;
    const isId = isValidObjectId(id);
    const dbQuery = isId ? { _id: id } : { slug: id };
    const course = await Course.findOne(dbQuery)
      .populate("technology")
      .populate("topic")
      .populate({
        path: "chapters",
        select: "title lessons",
        populate: {
          path: "lessons",
          select: "title slug",
        },
      })
      .lean();
    if (!course) {
      res.status(404);
      throw new Error("Course not found.");
    }
    let technologies = [];
    let topics = [];
    if (req.user && req.user.isAdmin) {
      technologies = await Technology.find().lean();
      topics = await Topic.find().lean();
    }
    return res.render("course/ViewPage", {
      course,
      technologies,
      topics,
      metaTitle: course.title,
      metaDescription: course.description,
    });
  },

  async create(req, res, next) {
    const { title, description, difficulty, length, type, technology, topic, link } = req.body;

    const technologyDoc = await Technology.findOneAndUpdate(
      { name: technology },
      { name: technology },
      { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
    );
    const topicDoc = await Topic.findOneAndUpdate(
      { name: topic },
      { name: topic },
      { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
    );
    const course = new Course({
      title,
      description,
      difficulty,
      length,
      type,
      technology: technologyDoc,
      topic: topicDoc,
      link,
    });
    await course.save();
    req.session.success = "Course added successfully.";
    return res.redirect("/free-courses/" + course._id);
  },

  async update(req, res, next) {
    const { id } = req.params;
    const { title, description, difficulty, length, type, technology, topic, link } = req.body;

    const technologyDoc = await Technology.findOneAndUpdate(
      { name: technology },
      { name: technology },
      { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
    );
    const topicDoc = await Topic.findOneAndUpdate(
      { name: topic },
      { name: topic },
      { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
    );

    await Course.updateOne(
      { _id: id },
      { title, description, difficulty, length, type, technology: technologyDoc, topic: topicDoc, link }
    );
    req.session.success = "Course update successfully.";
    return res.redirect("/free-courses/" + id);
  },

  async remove(req, res, next) {
    const { id } = req.params;
    await deleteByTag(id);
    await Course.deleteOne({ _id: id });
    await Chapter.deleteMany({ course: id });
    await Lesson.deleteMany({ course: id });
    req.session.success = "Course deleted successfully.";
    return res.redirect("/free-courses");
  },
};
