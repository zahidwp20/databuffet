require("dotenv").config();
const Course = require("./models/course");
// const Technology = require("./models/technology");
// const Topic = require("./models/topic");
const dbConnect = require("./config/db");

dbConnect();
async function seed() {
  const lessons = await Course.find();

  for (const lesson of lessons) {
    lesson.slug = lesson.title.replace(/\s+/g, "-").toLowerCase();
    await lesson.save();
  }
  console.log("complete");
  process.exit(0);
}

seed();
