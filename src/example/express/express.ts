const express = require("express");
const path = require("path");
const app = express();
const router = express.Router();

app.use(router);
app.use(express.static(path.join(__dirname, "public")));

app.listen(3030);
module.exports = app;