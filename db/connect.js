const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("\x1b[1m", "\x1b[32m", "Connected to MongoBD");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
