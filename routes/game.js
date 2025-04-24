const router = require("express").Router();
const play = require("../controllers/game");

router.post("/", play.playPage);
router.post("/question", play.generateQuestion);
router.post("/high/score", play.getHighScore);

module.exports = router;
