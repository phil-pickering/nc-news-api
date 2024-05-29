//topics.controllers.js
const { selectAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
