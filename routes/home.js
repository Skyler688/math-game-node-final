const router = require("express").Router();
const main = require("../controllers/home");

router.get("/", main.home);
router.get("/logout", main.logout);

module.exports = router;
