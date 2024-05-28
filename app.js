// app.js
const express = require("express");
const app = express();
const { getHelloWorld } = require("./controllers/test.controllers");

app.get("/", getHelloWorld);

module.exports = app;
