const AppError = require("../utils/ErrorHandling");

const handleCastErrorDB = (error) => {
  const message = `invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
};

const handleDublicateDB = (error) => {
  const value = error.keyValue.name;
  const message = `Duplicate field value "${value}", Please use another name`;
  return new AppError(message, 400);
};

const handleValidationDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid Input Data: ${errors.join(", ")}`;
  return new AppError(message, 400);
};

/* eslint-disable arrow-body-style */
const handleTokenError = (error) => {
  return new AppError("you are using invalid token!.", 401);
};

const handleExpiredToken = (error) => {
  return new AppError("you are using Expired token!.", 401);
};

const sendDevelopmentError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.errStatusCode).json({
      status: err.errStatus,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("error💥", err);
    res.status(err.errStatusCode).render("error", {
      title: "something went very wrong",
      msg: err.message,
    });
  }
};

const sendProductionError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOpertional) {
      return res.status(err.errStatusCode).render("error", {
        status: err.errStatus,
        msg: err.message,
      });
    }
    console.error("error💥", err);
    return res.status(err.errStatusCode).render("error", {
      status: "error",
      msg: "something went very wrong",
    });
  }

  if (err.isOpertional) {
    return res.status(err.errStatusCode).render("error", {
      title: "something went very wrong",
      msg: err.message,
    });
  }
  console.error("error💥", err);
  return res.status(err.errStatusCode).json({
    status: "error",
    message: "something went very wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.errStatusCode = err.errStatusCode || 500;
  err.errStatus = err.errStatus || "fail";

  if (process.env.NODE_ENV === "development") {
    sendDevelopmentError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateDB(error);
    if (error.name === "ValidationError") error = handleValidationDB(error);
    if (err.name === "JsonWebTokenError") error = handleTokenError(error);
    if (err.name === "TokenExpiredError") error = handleExpiredToken(error);
    sendProductionError(error, req, res);
  }
};
