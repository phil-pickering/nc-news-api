// app.js
const express = require("express");
const app = express();

app.use(express.json());

const {
  getAllArticles,
  getArticleById,
  postCommentByArticleId,
  patchArticleByArticleId,
  getAllCommentsByArticleId,
} = require("./controllers/articles.controllers");

const { getApiInfo } = require("./controllers/api.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");

app.get("/api", getApiInfo);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    console.log(err);
    res.status(404).send({ msg: "Not found" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

module.exports = app;
