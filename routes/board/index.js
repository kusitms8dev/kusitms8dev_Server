var express = require("express");
var router = express.Router();

//게시판 CRUD
router.use("/", require("./board"));

//게시판 스크랩
router.use("/scrap", require("./scrap"));

//게시판 좋아요
router.use("/like", require("./like"));

//게시판 신청
// router.use("/register", require("./register"));

module.exports = router;
