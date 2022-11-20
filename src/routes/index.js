const helloRouter = require("./hello");

module.exports = function route(app) {
  app.use("/hello", helloRouter);
};
