var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
게시판 조회
METHOD       : GET
URL          : /board?user={u_idx}&category={category}
*/
router.get("/", async (req, res, next) => {
  try {
    if (!req.query.category) {
      return res
        .status(200)
        .send(
          defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE)
        );
    }
    let selectBoardQuery;
    let selectBoardResult;

    if (req.query.category == "inner") {
      if (!req.query.user) {
        return res
          .status(200)
          .send(
            defaultRes.successFalse(
              statusCode.BAD_REQUEST,
              resMessage.NULL_VALUE
            )
          );
      }
      const selectUserQuery = "SELECT univ FROM User WHERE u_idx = ?";
      const selectUserResult = await db.queryParam_Parse(
        selectUserQuery,
        req.query.user
      );

      selectBoardQuery =
        "SELECT b_idx, category, title, content, date, writer, like_count, scrap_count FROM Board RIGHT JOIN User ON Board.writer = User.u_idx WHERE category = 'inner' and univ = ?";
      selectBoardResult = await db.queryParam_Parse(
        selectBoardQuery,
        selectUserResult[0].univ
      );
    } else {
      selectBoardQuery = "SELECT * FROM Board WHERE category = ?";
      selectBoardResult = await db.queryParam_Parse(
        selectBoardQuery,
        req.query.category
      );
    }

    if (!selectBoardResult[0]) {
      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.EMPTY_BOARD, [])
        );
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_BOARD,
          selectBoardResult
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_SELECT_BOARD
        )
      );
  }
});

/*
게시글 조회
METHOD       : GET
URL          : /board/{b_idx}
*/
router.get("/:b_idx", async (req, res, next) => {
  try {
    const selectInnerBoardDetailQuery = "SELECT * FROM Board WHERE b_idx = ?";
    const selectInnerBoardDetailResult = await db.queryParam_Parse(
      selectInnerBoardDetailQuery,
      req.params.b_idx
    );

    const selectCommentQuery = "SELECT * FROM Comment WHERE b_idx = ?"; //대댓글은 우선 나중에 구현
    const selectCommentResult = await db.queryParam_Parse(
      selectCommentQuery,
      req.params.b_idx
    );

    result = {
      b_idx: selectInnerBoardDetailResult[0].b_idx,
      category: selectInnerBoardDetailResult[0].category,
      title: selectInnerBoardDetailResult[0].title,
      content: selectInnerBoardDetailResult[0].content,
      date: selectInnerBoardDetailResult[0].date,
      writer: selectInnerBoardDetailResult[0].writer,
      like_count: selectInnerBoardDetailResult[0].like_count,
      scrap_count: selectInnerBoardDetailResult[0].scrap_count,
      Comment: selectCommentResult,
    };

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_POST,
          result
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_SELECT_POST
        )
      );
  }
});

/*
게시글 작성
METHOD       : POST
URL          : /board
BODY         : category = 게시판 유형
               title = 제목
               content = 내용
               date = 작성일
               writer = 작성자 u_idx
*/
router.post("/", async (req, res) => {
  try {
    const insertBoardQuery =
      "INSERT INTO Board (category, title, content, date, writer) VALUES (?, ?, ?, ?, ?)";
    const insertBoardResult = await db.queryParam_Arr(insertBoardQuery, [
      req.body.category,
      req.body.title,
      req.body.content,
      req.body.date,
      req.body.writer,
    ]);
    console.log(insertBoardResult);
    result = {
      b_idx: insertBoardResult.insertId,
    };

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.CREATED,
          resMessage.SUCCESS_WRITE_POST,
          result
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_WRITE_POST
        )
      );
  }
});

module.exports = router;
