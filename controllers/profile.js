const authMiddleware = require("../middleware/userSession");
const bcrypt = require("bcryptjs");
const UserSchema = require("../models/user");

const profilePage = [
  authMiddleware,
  (req, res) => {
    try {
      const username = req.session.user.username;

      res.render("profile", { username: username, message: null });
    } catch (error) {
      console.log("Error proccesing request: " + error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },
];

const updateUser = [
  authMiddleware,
  async (req, res) => {
    try {
      const sessionUsername = req.session.user.username;
      let { username, password } = req.body;

      if (!username) {
        username = sessionUsername;
      }

      // if no password check usename
      if (!password) {
        const checkUsername = await UserSchema.findOne({ username: username });
        if (checkUsername) {
          console.log("Error username taken");
          return res.render("profile", {
            username: sessionUsername,
            message: "Username taken, try again.",
          });
        }
      }

      const findUser = await UserSchema.findOne({ username: sessionUsername });
      if (!findUser) {
        console.log("Error finding user");
        return res.status(500).json({ message: "Error finding user" });
      }

      let hashedPass = "";

      if (!password) {
        hashedPass = findUser.password;
      } else {
        hashedPass = await bcrypt.hash(password, 10);
      }

      const updatedUser = {
        username: username,
        password: hashedPass,
        highScore: findUser.highScore,
      };

      const user = await UserSchema.findOneAndUpdate(
        { username: sessionUsername },
        updatedUser
      );
      if (!user) {
        console.log("Error finding user");
        return res.status(500).json({ message: "Error finding user" });
      }

      req.session.user = { username: username };

      res.redirect("/home");
    } catch (error) {
      console.log("Error proccesing request: " + error);
      res.status(500).json({ message: "Error updating user" });
    }
  },
];

const deleteUser = [
  authMiddleware,
  async (req, res) => {
    try {
      const username = req.session.user.username;

      const user = await UserSchema.findOneAndDelete({ username: username });
      if (!user) {
        console.log("Error finding user");
        return res.status(500).json({ message: "Error finding user" });
      }

      res.redirect("/auth/login");
    } catch (error) {
      console.log("Error proccesing request: " + error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },
];

module.exports = { profilePage, updateUser, deleteUser };
