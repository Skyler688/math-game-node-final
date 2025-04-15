const router = require("express").Router();
const controller = require("../controllers");

router.get("/hello", controller.hello);

module.exports = router;
