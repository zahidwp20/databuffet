const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, minlength: 5, lowercase: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Newsletter", newsletterSchema);
