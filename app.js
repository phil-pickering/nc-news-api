// app.js
const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getAllTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

module.exports = app;
