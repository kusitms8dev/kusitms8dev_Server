var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
연합게시판 리스트 조회
METHOD       : GET
URL          : /union
*/
router.get("/", async (req, res, next) => {
  try {
    const selectUnionBoardQuery =
      "SELECT * FROM Board WHERE category = 'union'";
    const selectUnionBoardResult = await db.queryParam_None(
      selectUnionBoardQuery
    );

    if (!selectUnionBoardResult[0]) {
      return res
        .status(200)
        .send(
          defaultRes.successTrue(
            statusCode.OK,
            resMessage.EMPTY_UNION_BOARD_LIST,
            []
          )
        );
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_UNION_BOARD_LIST,
          selectUnionBoardResult
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_SELECT_UNION_BOARD_LIST
        )
      );
  }
});

// /*
// 연합게시판 상세 조회
// METHOD       : GET
// URL          : /union/{b_idx}
// */
// router.get("/:b_idx", async (req, res, next) => {
//   try {
//     const selectUnionBoardDetailQuery =
//       "SELECT * FROM Board WHERE b_idx = ? and category = 'union'";
//     const selectUnionBoardDetailResult = await db.queryParam_Parse(
//       selectUnionBoardDetailQuery,
//       req.params.b_idx
//     );

//     const selectCommentQuery = "SELECT * FROM Comment WHERE b_idx = ?"; //대댓글은 우선 나중에 구현
//     const selectCommentResult = await db.queryParam_Parse(
//       selectCommentQuery,
//       req.body.b_idx
//     );

//     result = {
//       b_idx: selectUnionBoardDetailResult[0].b_idx,
//       category: selectUnionBoardDetailResult[0].category,
//       title: selectUnionBoardDetailResult[0].title,
//       content: selectUnionBoardDetailResult[0].content,
//       date: selectUnionBoardDetailResult[0].date,
//       writer: selectUnionBoardDetailResult[0].writer,
//       like_count: selectUnionBoardDetailResult[0].like_count,
//       scrap_count: selectUnionBoardDetailResult[0].scrap_count,
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
//           resMessage.SUCCESS_SELECT_UNION_BOARD,
//           result
//         )
//       );
//   } catch (error) {
//     return res
//       .status(200)
//       .send(
//         defaultRes.successFalse(
//           statusCode.INTERNAL_SERVER_ERROR,
//           resMessage.FAIL_SELECT_UNION_BOARD_DETAIL
//         )
//       );
//   }
// });

/*
연합게시판 등록
METHOD       : POST
URL          : /union
BODY         : category = 게시판 유형(union)
               title = 제목
               content = 내용
               date = 작성일
               writer = 작성자 u_idx
*/
router.post("/", async (req, res) => {
  try {
    const insertUnionBoardQuery =
      "INSERT INTO Board (category, title, content, date, writer) VALUES (?, ?, ?, ?, ?)";
    const insertUnionBoardResult = await db.queryParam_Arr(
      insertUnionBoardQuery,
      [
        "union",
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
          resMessage.SUCCESS_REGISTER_UNION_BOARD
        )
      );
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_REGISTER_UNION_BOARD
        )
      );
  }
});

module.exports = router;
