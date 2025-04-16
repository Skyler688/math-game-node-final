require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const PORT = 3000;

const connectDB = require("./db/connect");
const checkLoginRedirect = require("./middleware/redirect");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "Acropora",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours.
    },
  })
);

app.get("/", checkLoginRedirect);

app.use("/auth", require("./routes/userAuth"));
app.use("/home", require("./routes/index"));

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
