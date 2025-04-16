const UserSchema = require("../models/user");
const bcrypt = require("bcryptjs");

const loginPage = (req, res) => {
  try {
    res.render("login", { message: null });
  } catch (error) {
    console.error(error);
    res.status(`Server error: ${error.message}`);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserSchema.findOne({ username });
    if (!user) {
      console.log("\x1b[33m", "Invalid username");
      return res.render("login", { message: "Invalid username, try again." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("\x1b[33m", "Invalid password");
      return res.render("login", { message: "Invalid password, try again." });
    }

    req.session.user = user;
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(`Server error: ${error.message}`);
  }
};

const registerPage = (req, res) => {
  try {
    res.render("register", { message: null });
  } catch (error) {
    console.error(error);
    res.status(`Server error: ${error.message}`);
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);
    const user = {
      username: username,
      password: hashedPass,
      highScore: 0,
    };

    try {
      const createUser = await UserSchema.create(user);
    } catch (error) {
      if (error.code === 11000) {
        console.log("\x1b[33m", "Username already exists");
        return res.render("register", {
          message: "Username already exists, try again.",
        });
      }
    }

    res.render("login", { message: "Account successfully created." }); // add auto fill in user and pass.
  } catch (error) {
    console.error(error);
    res.status(`Server error: ${error.message}`);
  }
};

module.exports = { loginPage, login, registerPage, register };
