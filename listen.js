// listen.js
const app = require("./app");
const port = 9090;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
