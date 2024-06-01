// comments.controllers.js
const { removeCommentByCommentId } = require("../models/comments.models");

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then(() => res.status(204).send())
    .catch(next);
};
