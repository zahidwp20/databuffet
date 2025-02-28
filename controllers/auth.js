const passport = require("passport");
const User = require("../models/user");
// const crypto = require("crypto");
// const sendForgotMail = require("../config/mailer");

module.exports = {
  async getRegister(req, res, next) {
    return res.render("auth/SignupPage");
  },
  async register(req, res, next) {
    const { name, username, password, confirmPassword } = req.body;
    if (!name || !username || !password) {
      res.status(400);
      throw new Error("Please provide all the fields.");
    }
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Confirm password dose not match.");
    }
    const newUser = new User({ name, username });
    const user = await User.register(newUser, password);
    passport.authenticate("local")(req, res, function () {
      return res.redirect("/");
    });
  },

  async getLogin(req, res, next) {
    return res.render("auth/LoginPage");
  },
  async login(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error("Please provide username and password");
    }

    const { user, error } = await User.authenticate()(username.toLowerCase(), password);
    res.status(401);
    if (!user && error) throw error;
    req.login(user, function (err) {
      if (err) return next(err);
      return res.redirect("/");
    });
  },
  async changePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide both old password and new password.");
    }
    const user = await User.findOne({ _id: req.user._id });
    await user.changePassword(currentPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  },
  async logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  },
  async me(req, res, next) {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  },

  // async forgotPassword(req, res, next) {
  //   const { email } = req.body;
  //   if (!email) {
  //     res.status(400);
  //     throw new Error("Please provide your email address.");
  //   }
  //   const user = await User.findOne({ username: email });
  //   if (!user) {
  //     res.status(404);
  //     throw new Error("No account found by given email address.");
  //   }

  //   const token = crypto.randomBytes(32).toString("hex");
  //   const expiry = new Date();
  //   expiry.setHours(expiry.getHours() + 1);
  //   user.passwordResetToken = token;
  //   user.resetTokenExpires = expiry;
  //   await user.save();

  //   sendForgotMail({ name: user.name, email: user.username, token: token }, (err, info) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       return res.json({
  //         success: true,
  //         message:
  //           "A password reset message was sent to your email address with instructions to reset your password. lf you do not receive the password reset message within a few moments, please check your spam folder",
  //       });
  //     }
  //   });
  // },
  // async resetPassword(req, res, next) {
  //   const { token, newPassword } = req.body;
  //   if (!token) {
  //     res.status(400);
  //     throw new Error("Password link is invalid.");
  //   }
  //   if (!newPassword) {
  //     res.status(400);
  //     throw new Error("Please provide new password.");
  //   }

  //   const currentDate = new Date();
  //   const user = await User.findOne({ passwordResetToken: token, resetTokenExpires: { $gte: currentDate } });
  //   console.log({ passwordResetToken: token, resetTokenExpires: { $gte: currentDate } });
  //   if (!user) {
  //     res.status(400);
  //     throw new Error("Password link is invalid or expired.");
  //   }

  //   await user.setPassword(newPassword);
  //   user.passwordResetToken = null;
  //   user.resetTokenExpires = null;
  //   await user.save();

  //   return res.json({
  //     success: true,
  //     message: "Password reset successfully, you can login now with new password.",
  //   });
  // },
};
