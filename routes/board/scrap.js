var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
스크랩 변경
METHOD       : POST
URL          : /scrap
BODY         : u_idx = 사용자 고유 id
               b_idx = 게시판 고유 id
               date = 현재 시간
*/
router.post("/", async (req, res) => {
  if (!req.body.u_idx || !req.body.b_idx || !req.body.date) {
    return res
      .status(200)
      .send(defaultRes.successFalse(statusCode.OK, resMessage.NULL_VALUE));
  }

  try {
    const selectScrapBoardQuery =
      "SELECT * FROM Scrap WHERE u_idx = ? and b_idx = ?";
    const selectScrapBoardResult = await db.queryParam_Arr(
      selectScrapBoardQuery,
      [req.body.u_idx, req.body.b_idx]
    );

    if (selectScrapBoardResult[0] == null) {
      const insertScrapBoardQuery =
        "INSERT INTO Scrap (u_idx, b_idx, date) VALUES (?, ?, ?)";
      const insertScrapBoardResult = await db.queryParam_Arr(
        insertScrapBoardQuery,
        [req.body.u_idx, req.body.b_idx, req.body.date]
      );

      const updateScrapCountPlusQuery =
        "UPDATE Board SET scrap_count = scrap_count + 1 WHERE b_idx = ?";
      const updateScrapCountPlusResult = await db.queryParam_Parse(
        updateScrapCountPlusQuery,
        req.body.b_idx
      );

      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SCRAP_POST)
        );
    } else {
      const deleteScrapBoardQuery =
        "DELETE FROM Scrap WHERE u_idx = ? and b_idx = ?";
      const deleteScrapBoardResult = await db.queryParam_Arr(
        deleteScrapBoardQuery,
        [req.body.u_idx, req.body.b_idx]
      );

      const updateScrapCountMinusQuery =
        "UPDATE Board SET scrap_count = scrap_count - 1 WHERE b_idx = ?";
      const updateScrapCountMinusResult = await db.queryParam_Parse(
        updateScrapCountMinusQuery,
        req.body.b_idx
      );

      return res
        .status(200)
        .send(
          defaultRes.successTrue(
            statusCode.OK,
            resMessage.SUCCESS_DELETE_SCRAP_POST
          )
        );
    }
  } catch (error) {
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_CHANGE_POST_SCRAP_STATE
        )
      );
  }
});

module.exports = router;
