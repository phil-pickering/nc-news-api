// comments.models.js
const db = require("../db/connection");

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      const comment = rows[0];
      if (comment) {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
          comment_id,
        ]);
      } else {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comment_id}`,
        });
      }
    });
};
