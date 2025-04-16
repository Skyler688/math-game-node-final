const checkCookie = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/home");
  } else {
    res.redirect("/auth/login");
  }
};

module.exports = checkCookie;
