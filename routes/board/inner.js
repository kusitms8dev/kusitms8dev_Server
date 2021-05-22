var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
교내게시판 리스트 조회
METHOD       : GET
URL          : /inner
*/
router.get("/", async (req, res, next) => {
  try {
    const selectInnerBoardQuery =
      "SELECT * FROM Board WHERE category = 'inner'";
    const selectInnerBoardResult = await db.queryParam_None(
      selectInnerBoardQuery
    );

    if (!selectInnerBoardResult[0]) {
      return res
        .status(200)
        .send(
          defaultRes.successTrue(
            statusCode.OK,
            resMessage.EMPTY_INNER_BOARD_LIST,
            []
          )
        );
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_INNER_BOARD_LIST,
          selectInnerBoardResult
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_SELECT_INNER_BOARD_LIST
        )
      );
  }
});

// /*
// 교내게시판 상세 조회
// METHOD       : GET
// URL          : /inner/{b_idx}
// */
// router.get("/:b_idx", async (req, res, next) => {
//   try {
//     const selectInnerBoardDetailQuery = "SELECT * FROM Board WHERE b_idx = ?";
//     const selectInnerBoardDetailResult = await db.queryParam_Parse(
//       selectInnerBoardDetailQuery,
//       req.params.b_idx
//     );

//     const selectCommentQuery = "SELECT * FROM Comment WHERE b_idx = ?"; //대댓글은 우선 나중에 구현
//     const selectCommentResult = await db.queryParam_Parse(
//       selectCommentQuery,
//       req.body.b_idx
//     );

//     result = {
//       b_idx: selectInnerBoardDetailResult[0].b_idx,
//       category: selectInnerBoardDetailResult[0].category,
//       title: selectInnerBoardDetailResult[0].title,
//       content: selectInnerBoardDetailResult[0].content,
//       date: selectInnerBoardDetailResult[0].date,
//       writer: selectInnerBoardDetailResult[0].writer,
//       like_count: selectInnerBoardDetailResult[0].like_count,
//       scrap_count: selectInnerBoardDetailResult[0].scrap_count,
//       Comment: [],
//     };
//     if (selectCommentResult) {
//       result.Comment.push(selectCommentResult);
//     }

//     return res
//       .status(200)
//       .send(
//         defaultRes.successTrue(
//           statusCode.OK,
//           resMessage.SUCCESS_SELECT_INNER_BOARD,
//           result
//         )
//       );
//   } catch (error) {
//     return res
//       .status(200)
//       .send(
//         defaultRes.successFalse(
//           statusCode.INTERNAL_SERVER_ERROR,
//           resMessage.FAIL_SELECT_INNER_BOARD_DETAIL
//         )
//       );
//   }
// });

/*
교내게시판 등록
METHOD       : POST
URL          : /inner
BODY         : category = 게시판 유형(inner)
               title = 제목
               content = 내용
               date = 작성일
               writer = 작성자 u_idx
*/
router.post("/", async (req, res) => {
  try {
    const insertInnerBoardQuery =
      "INSERT INTO Board (category, title, content, date, writer) VALUES (?, ?, ?, ?, ?)";
    const insertInnerBoardResult = await db.queryParam_Arr(
      insertInnerBoardQuery,
      [
        "inner",
        req.body.title,
        req.body.content,
        req.body.date,
        req.body.writer,
      ]
    );

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_REGISTER_INNER_BOARD
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_REGISTER_INNER_BOARD
        )
      );
  }
});

module.exports = router;
