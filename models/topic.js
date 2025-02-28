const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
});

module.exports = new mongoose.model("Topic", topicSchema);
