const helloRouter = require("express").Router();
const helloController = require("../controllers/helloController");

helloRouter.get("/", helloController.hello);

module.exports = helloRouter;
