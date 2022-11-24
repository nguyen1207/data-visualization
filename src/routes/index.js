const helloRouter = require("./hello");
const homeRouter = require("./home");

module.exports = function route(app) {
  app.use("/hello", helloRouter);
  app.use("/", homeRouter);
};
