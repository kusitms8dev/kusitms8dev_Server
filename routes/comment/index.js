var express = require("express");
var router = express.Router();

//댓글 작성/
router.use("/", require("./comment"));

module.exports = router;
