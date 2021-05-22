var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

//게시판 CRUD
router.use("/", require("./board"));

//게시판 신청
// router.use("/register", require("./register"));

module.exports = router;
