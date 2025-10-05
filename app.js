/*=================================Middlewares=====================================
Aouther: Sohail Talaat
Date: 07/01/2025
version: 1.0.0
Description: training on creating routers in NodeJs
===================================================================================*/
const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/ErrorHandling");
const globalErrorHandler = require("./controllers/globalErrorHandling");
const chequesRouter = require("./routers/chequesRouter");
const app = express();

app.use(express.static(`${__dirname}/public`));
/*=================================Middlewares=====================================*/

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const rateLimit = rateLimiter({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "too many attempts, please try again",
});

app.use("/api", rateLimit);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.RequestTime = new Date().toISOString();
  next();
});

app.use(express.static(`${__dirname}/starter/public`));
/*=================================Using Routers=====================================*/

app.use("/api/v1/cheques", chequesRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} in this server`, 404);

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
