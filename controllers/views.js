const login = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error("\x1b[31m", error);
    res.status(500).send(error.message);
  }
};

const register = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error("\x1b[31m", error);
    res.status(500).send(error.message);
  }
};

const home = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (password != "pass") {
      res.redirect("/");
    }

    res.render("home", { user: username });
  } catch (error) {
    console.error("\x1b[31m", error);
    res.status(500).send(error.message);
  }
};

const game = async (req, res) => {
  try {
    res.render("game");
  } catch (error) {
    console.error("\x1b[31m", error);
    res.status(500).send(error.message);
  }
};

module.exports = { home, login, register, game };
