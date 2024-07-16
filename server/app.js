if (process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routers");
const errorHandler = require("./middlewares/errorHandler");
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.use(router)
app.use(errorHandler)

module.exports = app