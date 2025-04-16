const mongoose = require("mongoose");

const UserInfo = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("user", UserInfo);
