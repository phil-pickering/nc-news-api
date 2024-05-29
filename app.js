// app.js
const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controllers");
const { getApiInfo } = require("./controllers/api.controllers");

app.get("/api", getApiInfo);
app.get("/api/topics", getAllTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route does not exist" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
