const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/refreshToken").get(authController.refreshToken);
router.route("/revokeToken").post(authController.revokeToken);

module.exports = router;
