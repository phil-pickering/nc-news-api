// api.controllers.js
const fs = require("fs/promises");

exports.getApiInfo = (req, res) => {
  fs.readFile("endpoints.json", "utf-8").then((data) => {
    res.status(200).send(JSON.parse(data));
  });
};
