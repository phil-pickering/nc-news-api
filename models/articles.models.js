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
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (article) {
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = $1
            ORDER BY created_at DESC`,
            [article_id]
          )
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
    });
};

exports.insertCommentByArticleId = (article_id, comment) => {
  const { username, body } = comment;
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: `Username or comment can't be empty`,
    });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      const user = rows[0];
      if (user) {
        return db
          .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
          .then(({ rows }) => {
            const article = rows[0];
            if (article) {
              return db
                .query(
                  `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3)
                  RETURNING *`,
                  [article_id, username, body]
                )
                .then(({ rows }) => {
                  return rows[0];
                });
            } else {
              return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${article_id}`,
              });
            }
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No user found with the username: ${username}`,
        });
      }
    });
};

exports.updateArticleByArticleId = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Votes cannot be blank`,
    });
  }
  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: `Votes must be a number`,
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (article) {
        return db
          .query(
            `UPDATE articles SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *`,
            [inc_votes, article_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
    });
};
