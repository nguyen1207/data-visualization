const express = require("express");
const { engine } = require("express-handlebars");

const route = require("./routes");

const app = express();
const port = 3000;

app.use(express.static("src/public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

route(app);

app.listen(port, () => console.log(`Listening on port ${port}!`));
