const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    isAdmin: { type: Boolean, required: true, default: false },
    // passwordResetToken: { type: String },
    // resetTokenExpires: { type: Date },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        delete ret.salt;
        delete ret.hash;
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.salt;
        delete ret.hash;
      },
    },
  }
);

userSchema.plugin(passportLocalMongoose, {
  usernameCaseInsensitive: true,
  usernameLowerCase: true,
  selectFields: "name username points isAdmin",
});
module.exports = new mongoose.model("User", userSchema);
