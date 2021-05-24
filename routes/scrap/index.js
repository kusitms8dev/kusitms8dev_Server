var express = require("express");
var router = express.Router();

//스크랩
router.use("/", require("./scrap"));

module.exports = router;
