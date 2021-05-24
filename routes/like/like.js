var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
공감한 글 조회
METHOD       : GET
URL          : /like?user={u_idx}
*/
router.get("/", async (req, res, next) => {
  if (!req.query.user) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE)
      );
  }

  try {
    const selectLikedBoardQuery =
      "SELECT b_idx FROM Liked WHERE u_idx = ? and b_idx is not null";
    const selectLikedReportQuery =
      "SELECT r_idx FROM Liked WHERE u_idx = ? and r_idx is not null";

    const selectLikedBoardResult = await db.queryParam_Parse(
      selectLikedBoardQuery,
      req.query.user
    );

    const selectLikedReportResult = await db.queryParam_Parse(
      selectLikedReportQuery,
      req.query.user
    );

    if (!selectLikedBoardResult[0] && !selectLikedReportResult[0]) {
      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.NOT_EXIST_LIKED, [])
        );
    }
    var data = {
      board: [],
      report: [],
    };

    if (selectLikedBoardResult.length > 0) {
      for (var i = 0; i < selectLikedBoardResult.length; i++) {
        const selectBoardQuery = "SELECT * FROM Board WHERE b_idx = ?";
        const selectBoardResult = await db.queryParam_Parse(
          selectBoardQuery,
          selectLikedBoardResult[i].b_idx
        );

        var likedBoard = {
          b_idx: 0,
          category: "",
          title: "",
          content: "",
          date: "",
          writer: "",
          liked_count: 0,
          scrap_count: 0,
        };

        likedBoard.b_idx = selectBoardResult[0].b_idx;
        likedBoard.category = selectBoardResult[0].category;
        likedBoard.title = selectBoardResult[0].title;
        likedBoard.content = selectBoardResult[0].content;
        likedBoard.date = selectBoardResult[0].date;
        likedBoard.writer = selectBoardResult[0].writer;
        likedBoard.liked_count = selectBoardResult[0].liked_count;
        likedBoard.scrap_count = selectBoardResult[0].scrap_count;

        data.board.push(likedBoard);
      }
    }

    if (selectLikedReportResult.length > 0) {
      for (var i = 0; i < selectScrapReportResult.length; i++) {
        const selectReportQuery = "SELECT * FROM Report WHERE r_idx = ?";
        const selectReportResult = await db.queryParam_Parse(
          selectReportQuery,
          selectLikedReportResult[i].r_idx
        );

        var likedReport = {
          r_idx: 0,
          //추가하기
          liked_count: 0,
          scrap_count: 0,
        };

        likedReport.r_idx = selectReportResult[0].r_idx;
        //추가하기
        likedReport.liked_count = selectReportResult[0].liked_count;
        likedReport.scrap_count = selectReportResult[0].scrap_count;

        data.report.push(likedReport);
      }
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_LIKED,
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
          resMessage.FAIL_SELECT_LIKED
        )
      );
  }
});

module.exports = router;
