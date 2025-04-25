const router = require("express").Router();
const profile = require("../controllers/profile");

router.get("/", profile.profilePage);
router.post("/update", profile.updateUser);
router.get("/delete", profile.deleteUser);

module.exports = router;
