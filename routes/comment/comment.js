var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
댓글 작성
METHOD       : POST
URL          : /comment
BODY         : b_idx = 댓글을 남기는 게시판의 고유 id
               content = 내용
               date = 작성일
               writer = 작성자 u_idx
               parent_comment = 부모 댓글 고유 id(없으면 NULL)
*/
router.post("/", async (req, res) => {
  try {
    const selectCommentQuery =
      "SELECT DISTINCT nickname FROM Comment WHERE b_idx = ? and nickname != ?";
    const selectNicknameQuery =
      "SELECT nickname FROM Comment WHERE b_idx = ? and writer = ?";
    const selectBoardQuery = "SELECT writer FROM Board WHERE b_idx = ?";
    const insertCommentQuery =
      "INSERT INTO Comment (b_idx, content, date, writer, nickname, parent_comment) VALUES (?, ?, ?, ?, ?, ?)";

    let data = {
      writer: "",
      content: req.body.content,
      date: req.body.date,
      parent_comment: req.body.parent_comment,
    };

    const selectBoardResult = await db.queryParam_Parse(
      selectBoardQuery,
      req.body.b_idx
    );

    console.log(selectBoardResult);
    if (selectBoardResult[0].writer == req.body.writer) {
      console.log("익명(글쓴이)");
      var insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [
        req.body.b_idx,
        req.body.content,
        req.body.date,
        req.body.writer,
        "익명(글쓴이)",
        req.body.parent_comment,
      ]);
      data.writer = "익명(글쓴이)";
    } else {
      const selectCommentResult = await db.queryParam_Arr(selectCommentQuery, [
        req.body.b_idx,
        "익명(글쓴이)",
      ]);
      console.log(selectCommentResult);
      if (!selectCommentResult[0]) {
        console.log("익명1");
        var insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [
          req.body.b_idx,
          req.body.content,
          req.body.date,
          req.body.writer,
          "익명1",
          req.body.parent_comment,
        ]);
        data.writer = "익명1";
      } else {
        const selectNicknameResult = await db.queryParam_Arr(
          selectNicknameQuery,
          [req.body.b_idx, req.body.writer]
        );
        if (!selectNicknameResult[0]) {
          console.log("익명 + 1");
          let insertCommentResult = await db.queryParam_Arr(
            insertCommentQuery,
            [
              req.body.b_idx,
              req.body.content,
              req.body.date,
              req.body.writer,
              "익명" + (selectCommentResult.length + 1),
              req.body.parent_comment,
            ]
          );
          data.writer = "익명" + (selectCommentResult.length + 1);
        } else {
          console.log("기존 닉네임 가져오기");
          let insertCommentResult = await db.queryParam_Arr(
            insertCommentQuery,
            [
              req.body.b_idx,
              req.body.content,
              req.body.date,
              req.body.writer,
              selectNicknameResult[0].nickname,
              req.body.parent_comment,
            ]
          );
          data.writer = selectNicknameResult[0].nickname;
        }
      }
    }

    if (req.body.parent_comment != null) {
      console.log("in");
      console.log(req.body.parent_comment);
      const selectChildCommentQuery =
        "SELECT child_comment FROM Comment WHERE c_idx = ?";
      const selectChildCommentResult = await db.queryParam_Parse(
        selectChildCommentQuery,
        req.body.parent_comment
      );

      if (selectChildCommentResult[0].child_comment == 0) {
        const updateChildCommentStateQuery =
          "UPDATE Comment SET Comment.child_comment = 1 WHERE c_idx = ?";
        const updateChildCommentStateResult = await db.queryParam_Parse(
          updateChildCommentStateQuery,
          req.body.parent_comment
        );
      }
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.CREATED,
          resMessage.SUCCESS_WRITE_COMMENT,
          data
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_WRITE_COMMENT
        )
      );
  }
});

module.exports = router;
