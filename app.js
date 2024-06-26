// app.js
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const {
  getAllArticles,
  getArticleById,
  postCommentByArticleId,
  patchArticleByArticleId,
  getAllCommentsByArticleId,
} = require("./controllers/articles.controllers");

const {
  deleteCommentByCommentId,
} = require("./controllers/comments.controllers");

const { getApiInfo } = require("./controllers/api.controllers");
const { getAllUsers } = require("./controllers/users.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");

app.get("/api", getApiInfo);
app.get("/api/users", getAllUsers);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

module.exports = app;
