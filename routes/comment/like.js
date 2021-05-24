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
               c_idx = 댓글 고유 id
               date = 현재 시간
*/
router.post("/", async (req, res) => {
  if (!req.body.u_idx || !req.body.c_idx || !req.body.date) {
    return res
      .status(200)
      .send(defaultRes.successFalse(statusCode.OK, resMessage.NULL_VALUE));
  }

  try {
    const selectLikeCommentQuery =
      "SELECT * FROM Liked WHERE u_idx = ? and c_idx = ?";
    const selectLikeCommentResult = await db.queryParam_Arr(
      selectLikeCommentQuery,
      [req.body.u_idx, req.body.c_idx]
    );

    if (selectLikeCommentResult[0] == null) {
      const insertLikeCommentQuery =
        "INSERT INTO Liked (u_idx, c_idx, date) VALUES (?, ?, ?)";
      const insertLikeCommentResult = await db.queryParam_Arr(
        insertLikeCommentQuery,
        [req.body.u_idx, req.body.c_idx, req.body.date]
      );

      const updateLikeCountPlusQuery =
        "UPDATE Comment SET liked_count = liked_count + 1 WHERE c_idx = ?";
      const updateLikeCountPlusResult = await db.queryParam_Parse(
        updateLikeCountPlusQuery,
        req.body.c_idx
      );

      return res
        .status(200)
        .send(
          defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIKE_COMMENT)
        );
    } else {
      const deleteLikeCommentQuery =
        "DELETE FROM Liked WHERE u_idx = ? and c_idx = ?";
      const deleteLikeCommentResult = await db.queryParam_Arr(
        deleteLikeCommentQuery,
        [req.body.u_idx, req.body.c_idx]
      );

      const updateLikeCountMinusQuery =
        "UPDATE Comment SET liked_count = liked_count - 1 WHERE c_idx = ?";
      const updateLikeCountMinusResult = await db.queryParam_Parse(
        updateLikeCountMinusQuery,
        req.body.c_idx
      );

      return res
        .status(200)
        .send(
          defaultRes.successTrue(
            statusCode.OK,
            resMessage.SUCCESS_DELETE_LIKE_COMMENT
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
          resMessage.FAIL_CHANGE_COMMENT_LIKE_STATE
        )
      );
  }
});

module.exports = router;
