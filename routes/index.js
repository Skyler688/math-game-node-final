const router = require("express").Router();
const main = require("../controllers");

router.get("/", main.home);
router.get("/logout", main.logout);

module.exports = router;
