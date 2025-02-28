const createError = require("http-errors");
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dbConnect = require("./config/db");
const passportInit = require("./config/passport");
const methodOverride = require("method-override");
const enforce = require("express-sslify");
const wwwRedirect = require("./utils/wwwRedirect");
// const { errorHandler } = require("./middleware/errorMiddleware");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const chapterRouter = require("./routes/chapter");
const lessonRouter = require("./routes/lesson");
const newsletterRouter = require("./routes/newsletter");
const { menuData } = require("./middleware/menuMiddleware");

const app = express();
passportInit(app);
dbConnect();

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(wwwRedirect);
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set locals vars
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.metaTitle = "Free Data Learning Courses";
  res.locals.metaDescription =
    "Explore a buffet of free data learning courses at Databuffet.io. Enhance your skills with our diverse selection of coding and data-related courses.";
  res.locals.canonical = req.originalUrl;
  //set error message
  res.locals.error = "";
  if (req.session.error) {
    res.locals.error = req.session.error;
    res.status(req.session.errorCode || 500);
  }
  delete req.session.error;
  delete req.session.errorCode;

  //set success message
  res.locals.success = req.session.success || "";
  delete req.session.success;

  next();
});
app.get("*", menuData);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/", courseRouter);
app.use("/chapters", chapterRouter);
app.use("/lessons", lessonRouter);
app.use("/newsletters", newsletterRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).render("404.ejs");
});

// error handler
app.use(function (err, req, res, next) {
  if (req.app.get("env") === "development") {
    console.log(err);
  }
  req.session.error = err.message;
  req.session.errorCode = res.statusCode || 500;
  res.redirect("back");
});

module.exports = app;
