const router = require("express").Router();
const views = require("../controllers/views");

router.get("/", views.login);
router.get("/register", views.register);
router.post("/home", views.home);
router.post("/game", views.game);

module.exports = router;
