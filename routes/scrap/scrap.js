var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
스크랩 조회
METHOD       : GET
URL          : /scrap?user={u_idx}
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
    const selectScrapBoardQuery =
      "SELECT b_idx FROM Scrap WHERE u_idx = ? and b_idx is not null";
    const selectScrapReportQuery =
      "SELECT r_idx FROM Scrap WHERE u_idx = ? and r_idx is not null";

    const selectScrapBoardResult = await db.queryParam_Parse(
      selectScrapBoardQuery,
      req.query.user
    );

    const selectScrapReportResult = await db.queryParam_Parse(
      selectScrapReportQuery,
      req.query.user
    );

    if (!selectScrapBoardResult[0] && !selectScrapReportResult[0]) {
      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.NOT_EXIST_SCRAP, [])
        );
    }
    var data = {
      board: [],
      report: [],
    };

    if (selectScrapBoardResult.length > 0) {
      for (var i = 0; i < selectScrapBoardResult.length; i++) {
        const selectBoardQuery = "SELECT * FROM Board WHERE b_idx = ?";
        const selectBoardResult = await db.queryParam_Parse(
          selectBoardQuery,
          selectScrapBoardResult[i].b_idx
        );

        var scrapBoard = {
          b_idx: 0,
          category: "",
          title: "",
          content: "",
          date: "",
          writer: "",
          like_count: 0,
          scrap_count: 0,
        };

        scrapBoard.b_idx = selectBoardResult[0].b_idx;
        scrapBoard.category = selectBoardResult[0].category;
        scrapBoard.title = selectBoardResult[0].title;
        scrapBoard.content = selectBoardResult[0].content;
        scrapBoard.date = selectBoardResult[0].date;
        scrapBoard.writer = selectBoardResult[0].writer;
        scrapBoard.like_count = selectBoardResult[0].like_count;
        scrapBoard.scrap_count = selectBoardResult[0].scrap_count;

        data.board.push(scrapBoard);
      }
    }

    if (selectScrapReportResult.length > 0) {
      for (var i = 0; i < selectScrapReportResult.length; i++) {
        const selectReportQuery = "SELECT * FROM Report WHERE r_idx = ?";
        const selectReportResult = await db.queryParam_Parse(
          selectReportQuery,
          selectScrapReportResult[i].r_idx
        );

        var scrapReport = {
          r_idx: 0,
          //추가하기
          like_count: 0,
          scrap_count: 0,
        };

        scrapReport.r_idx = selectReportResult[0].r_idx;
        //추가하기
        scrapReport.like_count = selectReportResult[0].like_count;
        scrapReport.scrap_count = selectReportResult[0].scrap_count;

        data.report.push(scrapReport);
      }
    }

    return res
      .status(200)
      .send(
        defaultRes.successTrue(
          statusCode.OK,
          resMessage.SUCCESS_SELECT_SCRAP,
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
          resMessage.FAIL_SELECT_SCRAP
        )
      );
  }
});

module.exports = router;
