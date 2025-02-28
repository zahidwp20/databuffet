const { asyncErrorHandler } = require("./errorMiddleware");
const Course = require("../models/course");

const CourseAgg = [
  {
    $match: {
      type: "course",
    },
  },
  {
    $project: {
      _id: 1,
      slug: 1,
      title: 1,
      difficulty: 1,
    },
  },
  {
    $group: {
      _id: "$difficulty",
      courses: {
        $topN: {
          n: 10,
          sortBy: {
            title: -1,
          },
          output: "$$ROOT",
        },
      },
    },
  },
];

const menuData = asyncErrorHandler(async (req, res, next) => {
  const courses = await Course.aggregate(CourseAgg);
  const projects = await Course.find({ type: "project" }).select("title slug").limit(10).lean();

  res.locals.menuData = Object.assign({}, ...courses.map((c) => ({ [c._id]: c.courses })));
  res.locals.menuData.projects = projects;
  next();
});

module.exports = { menuData };
