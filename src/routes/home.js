const homeRouter = require("express").Router();
const homeController = require("../controllers/homeController");

homeRouter.get("/deaths/:country", homeController.getDeathsUntilNowByCountry);
homeRouter.get("/", homeController.home);

module.exports = homeRouter;
