const router = require("express").Router();
const user = require("../controllers/userAuth");

router.get("/login", user.loginPage);
router.post("/login", user.login);
router.get("/register", user.registerPage);
router.post("/register", user.register);

module.exports = router;
