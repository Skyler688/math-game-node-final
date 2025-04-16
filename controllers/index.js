const authMiddleware = require("../middleware/userSession");

const home = [
  authMiddleware,
  (req, res) => {
    try {
      res.render("home");
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
