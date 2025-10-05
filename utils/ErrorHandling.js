class AppError extends Error {
  constructor(message, errCode) {
    super(message);
    this.errStatusCode = errCode;
    this.errStatus = `${errCode}`.startsWith('5') ? 'error' : 'fail';
    this.isOpertional = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
