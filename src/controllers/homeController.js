const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { parse } = require("csv-parse");

const DEATHS_UNTIL_NOW_URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

const homeController = {
  async home(req, res, next) {
    const countries = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../data/countries.json"))
    );

    const response = await axios.get(DEATHS_UNTIL_NOW_URL);

    const data = response.data;

    parse(data, (err, records) => {
      if (err) {
        next(err);
      }

      const totalDeathsByCountry = {};

      records.forEach((record) => {
        const countrySplit = record[1].split(", ");
        let country;
        if (countrySplit.length === 2) {
          country = countrySplit[1] + " " + countrySplit[0];
        } else country = countrySplit.join(" ").replace("*", "");

        if (country === "Country/Region") return;

        if (totalDeathsByCountry[country])
          totalDeathsByCountry[country] += parseInt(
            record[record.length - 1],
            10
          );
        else
          totalDeathsByCountry[country] = parseInt(
            record[record.length - 1],
            10
          );
      });

      console.log(totalDeathsByCountry);

      res.render("home.handlebars", {
        data: {
          countries: countries,
          totalDeathsByCountry: totalDeathsByCountry,
        },
      });
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
      const dateHeader = records[0].slice(4);
      console.log(records[0].slice(4));

      const countryData = records.find((record) => record[1] === country);

      const data = [];

      for (let i = 4; i < countryData.length; i++) {
        data.push([dateHeader[i - 4], parseInt(countryData[i], 10)]);
      }

      console.log(data);

      const temp = [];

      for (let i = 0; i < data.length; i++) {
        const dateSplit = data[i][0].split("/");
        const startMonth = parseInt(dateSplit[0], 10);
        const startYear = parseInt(dateSplit[2], 10);

        temp.push([`${startMonth}/${startYear}`, data[i][1]]);

        let j = i + 1;
        while (1) {
          if (j >= data.length) break;
          const dateSplit = data[j][0].split("/");
          const endMonth = parseInt(dateSplit[0], 10);
          const endYear = parseInt(dateSplit[2], 10);

          if (startMonth == endMonth && startYear === endYear) {
            temp[temp.length - 1][1] = data[j][1];
            j++;
          } else {
            break;
          }
        }

        i = j + 1;
      }

      const finalData = [];

      console.log(temp);

      for (let i = 0; i < temp.length; i += 3) {
        const dateSplit = temp[i][0].split("/");
        const month = parseInt(dateSplit[0], 10);
        const year = parseInt(dateSplit[1], 10);

        const q = "Q" + Math.ceil(month / 3);

        let cases = 0;

        for (let j = i; j < i + 3; j++) {
          if (j >= temp.length) break;
          cases += temp[j][1];
        }


        finalData.push([`${q} ${year}`, cases]);
      }
      console.log(finalData);

      res.render("deathsByCountry.handlebars", { data: finalData, country });
    });
  },
};

module.exports = homeController;
