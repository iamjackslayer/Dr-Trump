const express = require("express");
require("./main");
var app = express();
app.get("/", function (req, res) {
  res.json({ server: "Hi from heroku env" });
});
