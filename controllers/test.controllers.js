// test.controllers.js
exports.getHelloWorld =
  ("/",
  (req, res) => {
    res.status(200).send("Hello World!");
  });
