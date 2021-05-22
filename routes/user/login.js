var express = require("express");
var router = express.Router();

const crypto = require("crypto-promise");

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
로그인
METHOD       : POST
URL          : /user/login
BODY         : email = 사용자 아이디
               password = 사용자 패스워드
*/

router.post("/", async (req, res) => {
  const selectUserQuery = "SELECT * FROM User WHERE email = ?";
  const selectUserResult = await db.queryParam_Parse(selectUserQuery, [
    req.body.email,
  ]);
  console.log(selectUserResult[0]); //유저 정보

  if (selectUserResult[0] == null) {
    //id가 존재하지 않으면
    console.log("email이 존재하지 않음");
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.BAD_REQUEST,
          resMessage.NOT_EXIST_EMAIL
        )
      );
  }
  const salt = selectUserResult[0].password_salt;
  const hashedEnterPw = await crypto.pbkdf2(
    req.body.password.toString(),
    salt,
    1000,
    32,
    "SHA512"
  );

  if (selectUserResult[0].password == hashedEnterPw.toString("base64")) {
    const userInfo = {
      u_idx: selectUserResult[0].u_idx,
      email: selectUserResult[0].email,
      name: selectUserResult[0].name,
    };
    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SIGNIN,
          userInfo
        )
      );
  }
  console.log("비밀번호가 일치하지 않음");
  return res
    .status(200)
    .send(
      defaultRes.successFalse(
        statusCode.BAD_REQUEST,
        resMessage.NOT_CORRECT_PASSWORD
      )
    );
});

module.exports = router;
