const AppError = require("../utils/ErrorHandling");

// Mongo errors
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateDB = (err) => {
  // التقاط أي حقل مكرر من keyValue
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "duplicate";
  return new AppError(
    `Duplicate field value "${value}", please use another value`,
    400
  );
};

const handleValidationDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(", ")}`;
  return new AppError(message, 400);
};

// JWT errors
const handleTokenError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleExpiredToken = () =>
  new AppError("Your token has expired. Please log in again.", 401);

// DEV sender
const sendErrorDev = (err, req, res) => {
  // APIs → JSON
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // SSR pages (اختياري)
  return res.status(err.statusCode || 500).render("error", {
    title: "Error",
    msg: err.message,
  });
};

// PROD sender
const sendErrorProd = (err, req, res) => {
  // APIs → JSON
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

  // SSR pages (اختياري)
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Error",
      msg: err.message,
    });
  }
  console.error("ERROR 💥", err);
  return res.status(500).render("error", {
    title: "Error",
    msg: "Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  // لا تحاول إرسال رد لو الهيدر أرسل بالفعل
  if (res.headersSent) {
    return next(err);
  }

  // توحيد الخصائص
  err.statusCode = err.statusCode || err.errStatusCode || 500;
  err.status =
    err.status ||
    err.errStatus ||
    (String(err.statusCode).startsWith("4") ? "fail" : "error");
  // AppError الحقيقي يضع isOperational=true؛ لباقي الأخطاء اعتبرها غير تشغيلية
  if (typeof err.isOperational === "undefined") {
    err.isOperational = false;
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, req, res);
  }

  // production
  let error = Object.create(err);
  error.message = err.message;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateDB(error);
  if (error.name === "ValidationError") error = handleValidationDB(error);
  if (error.name === "JsonWebTokenError") error = handleTokenError(error);
  if (error.name === "TokenExpiredError") error = handleExpiredToken(error);

  return sendErrorProd(error, req, res);
};
