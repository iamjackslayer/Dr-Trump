const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  telgusername: {
    type: String,
    required: true,
  },
  telgid: {
    type: String,
    required: true,
  },
  stuid: {
    type: String,
    required: true,
  },
  stupassword: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
