var express = require("express");
var router = express.Router();

//댓글 작성
router.use("/", require("./comment"));

//댓글 좋아요 변경
router.use("/like", require("./like"));

module.exports = router;
