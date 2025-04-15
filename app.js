require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

const connectDB = require("./db/connect");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/views"));

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
