var express = require("express");
var router = express.Router();

const crypto = require("crypto-promise");

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");
const { FAIL_REGISTER_WORD } = require("../../module/utils/responseMessage");

/*
회원가입
METHOD       : POST
URL          : /user/register
BODY         : email = 회원가입 아이디
               password = 회원가입 패스워드
               name =  회원가입 이름
               univ = 대학교
               major = 학과
               field = 계열
*/

router.post("/", async (req, res) => {
  const selectUserQuery = "SELECT * FROM User Where email = ?";
  const selectUserResult = await db.queryParam_Parse(
    selectUserQuery,
    req.body.email
  );

  if (selectUserResult[0]) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.BAD_REQUEST,
          resMessage.ALREADY_EXIST_USER
        )
      );
  }
  try {
    const signupQuery =
      "INSERT INTO User (email, password, password_salt, name, univ, major, field) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const buf = await crypto.randomBytes(64);
    const salt = buf.toString("base64");
    const hashedPw = await crypto.pbkdf2(
      req.body.password.toString(),
      salt,
      1000,
      32,
      "SHA512"
    );

    const signupResult = await db.queryParam_Arr(signupQuery, [
      req.body.email,
      hashedPw.toString("base64"),
      salt,
      req.body.name,
      req.body.univ,
      req.body.major,
      req.body.field,
    ]);

    console.log(signupResult);

    //쿼리문이 성공했을 때
    const userInfo = {
      u_idx: signupResult.insertId,
      email: req.body.email,
      name: req.body.name,
    };

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SIGNUP,
          userInfo
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_SIGNUP
        )
      );
  }
});

/*
이메일 중복체크
METHOD       : GET
URL          : /user/register/check?email={email}
*/

router.get("/check", async (req, res) => {
  const selectEmailQuery = "SELECT * FROM User WHERE email = ?";
  const selectEmailResult = await db.queryParam_Parse(selectEmailQuery, [
    req.query.email,
  ]);

  if (selectEmailResult[0] == null) {
    console.log("해당 이메일 사용 가능");
    return res
      .status(200)
      .send(defaultRes.successTrue(statusCode.OK, resMessage.USABLE_EMAIL));
  } else {
    console.log("이미 존재");
    return res
      .status(200)
      .send(
        defaultRes.successTrue(statusCode.OK, resMessage.ALREADY_EXIST_EMAIL)
      );
  }
});

module.exports = router;
