const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { parse } = require("csv-parse");

const DEATHS_UNTIL_NOW_URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

const homeController = {
  async home(req, res, next) {
    const countries = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../data/countries.json"))
    );

    res.render("home.handlebars", {
      countries: countries,
    });
  },

  async getDeathsUntilNowByCountry(req, res, next) {
    const { country } = req.params;
    const response = await axios.get(DEATHS_UNTIL_NOW_URL);

    const data = response.data;

    parse(data, (err, records) => {
      if (err) {
        next(err);
      }

      const countryData = records.find((record) => record[1] === country);

      res.send(countryData);
    });
  },
};

module.exports = homeController;
