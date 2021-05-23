var express = require("express");
var router = express.Router();

/* GET home page. */

router.use("/user", require("./user/index"));
router.use("/board", require("./board/index"));
router.use("/comment", require("./comment/index"));

module.exports = router;
