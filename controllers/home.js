const authMiddleware = require("../middleware/userSession");
const user = require("../models/user");
const UserSchema = require("../models/user");

const home = [
  authMiddleware,
  async (req, res) => {
    try {
      const username = req.session.user.username;

      const user = await UserSchema.findOne({ username: username });
      if (!user) {
        console.log("Error finding user:" + error);
        res.status(500).json({ message: "Error finding user" });
      }

      res.render("home", { user: username, highScore: user.highScore });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Server error: ${error.message}`);
    }
  },
];

const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out :(");
      }

      res.clearCookie("connect.sid");

      res.redirect("/auth/login");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error.message}`);
  }
};

module.exports = { home, logout };
