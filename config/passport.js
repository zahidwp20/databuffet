const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function (app) {
  //Session and Passport Setup
  const sessionMiddleware = session({
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    secret: process.env.SESSION_KEY || "secret session pass",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
