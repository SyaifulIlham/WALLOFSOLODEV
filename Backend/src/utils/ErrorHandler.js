class ErrorHandler extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const data = err.data || null;

  console.error(err);

  const body = { success: false, message };
  if (data) body.data = data;

  res.status(statusCode).json(body);
};

module.exports = { ErrorHandler, errorMiddleware };