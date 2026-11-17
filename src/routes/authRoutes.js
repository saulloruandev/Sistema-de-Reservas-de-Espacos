const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/register", controller.cadastrar);
router.post("/login", controller.login);

module.exports = router;
