require("dotenv").config();
require("./helpers/global.js");

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const multer = require('multer');
const cors = require("cors");
const db = require("./config/db.config.js");

const app = express();
// const upload = multer();

app.use(cors());
// app.use(upload.any());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// define routes
app.use("/api/admin", require("./routes/admin/admin.routes.js"));
app.use("/api/user", require("./routes/user.routes.js"));
app.use("/api/project", require("./routes/project.routes.js"));
app.use("/api/board", require("./routes/board.routes.js"));

// test route
app.get("/", (req, res) => {
  const data = {
    app_name: "Unikwork-Board-Backend",
    msg: "Welcome to Unikwork-Board-Backend",
  };
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  // });
  return RESPONSE.success(res, data);
});

// not found url
app.use((req, res) => {
  return RESPONSE.error(res, 9001, 404);
});

module.exports = app;
