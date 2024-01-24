const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
  tagType: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tags", tagsSchema);
