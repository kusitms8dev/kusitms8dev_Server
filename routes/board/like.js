var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

/*
좋아요 변경
METHOD       : POST
URL          : /like
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
    const selectLikeBoardQuery =
      "SELECT * FROM Liked WHERE u_idx = ? and b_idx = ?";
    const selectLikeBoardResult = await db.queryParam_Arr(
      selectLikeBoardQuery,
      [req.body.u_idx, req.body.b_idx]
    );

    if (selectLikeBoardResult[0] == null) {
      const insertLikeBoardQuery =
        "INSERT INTO Liked (u_idx, b_idx, date) VALUES (?, ?, ?)";
      const insertLikeBoardResult = await db.queryParam_Arr(
        insertLikeBoardQuery,
        [req.body.u_idx, req.body.b_idx, req.body.date]
      );

      const updateLikeCountPlusQuery =
        "UPDATE Board SET liked_count = liked_count + 1 WHERE b_idx = ?";
      const updateLikeCountPlusResult = await db.queryParam_Parse(
        updateLikeCountPlusQuery,
        req.body.b_idx
      );

      console.log(updateLikeCountPlusResult);

      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIKE_POST)
        );
    } else {
      const deleteLikeBoardQuery =
        "DELETE FROM Liked WHERE u_idx = ? and b_idx = ?";
      const deleteLikeBoardResult = await db.queryParam_Arr(
        deleteLikeBoardQuery,
        [req.body.u_idx, req.body.b_idx]
      );

      const updateLikeCountMinusQuery =
        "UPDATE Board SET liked_count = liked_count - 1 WHERE b_idx = ?";
      const updateLikeCountMinusResult = await db.queryParam_Parse(
        updateLikeCountMinusQuery,
        req.body.b_idx
      );

      return res
        .status(200)
        .send(
          defaultRes.successTrue(
            statusCode.OK,
            resMessage.SUCCESS_DELETE_LIKE_POST
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .send(
        defaultRes.successFalse(
          statusCode.INTERNAL_SERVER_ERROR,
          resMessage.FAIL_CHANGE_POST_LIKE_STATE
        )
      );
  }
});

module.exports = router;
