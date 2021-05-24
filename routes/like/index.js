var express = require("express");
var router = express.Router();

//스크랩
router.use("/", require("./like"));

module.exports = router;
