var express = require("express");
var router = express.Router();

//회원가입
router.use("/register", require("./register"));
//로그인
router.use("/login", require("./login"));

module.exports = router;
