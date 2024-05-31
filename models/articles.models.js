// articles.models.js
const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.author, articles.title, articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectAllCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      const comments = rows[0];
      if (!comments) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${article_id}`,
        });
      }
      return rows;
    });
};
