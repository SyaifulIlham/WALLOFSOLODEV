class ErrorHandler extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  // Log the original error for debugging
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  const data = err.data || null;

  // Handle database errors
  if (isDatabaseError(err)) {
    const dbErrorInfo = mapDatabaseError(err);
    statusCode = dbErrorInfo.statusCode;
    message = dbErrorInfo.message;
  }

  const body = { success: false, message };
  if (data) body.data = data;

  res.status(statusCode).json(body);
};

// Check if error is a database error
const isDatabaseError = (err) => {
  const errorMessage = err.message || '';
  const errorCode = err.code || '';
  
  return (
    err.name === 'QueryFailedError' ||
    err.name === 'DatabaseError' ||
    errorMessage.includes('FOREIGN KEY') ||
    errorMessage.includes('foreign key') ||
    errorMessage.includes('Duplicate entry') ||
    errorMessage.includes('NOT NULL') ||
    errorMessage.includes('not null') ||
    errorCode === 'ER_NO_REFERENCED_ROW' ||
    errorCode === 'ER_NO_REFERENCED_ROW_2' ||
    errorCode === 'ER_DUP_ENTRY' ||
    errorCode === 'ER_BAD_NULL_ERROR'
  );
};

// Map database errors to user-friendly messages
const mapDatabaseError = (err) => {
  const errorMessage = err.message || '';
  const errorCode = err.code || '';

  // Foreign key constraint failures
  if (
    errorCode === 'ER_NO_REFERENCED_ROW' ||
    errorCode === 'ER_NO_REFERENCED_ROW_2' ||
    errorMessage.includes('FOREIGN KEY') ||
    errorMessage.includes('foreign key')
  ) {
    return {
      statusCode: 400,
      message: 'Referenced data not found. Please ensure all related records exist.'
    };
  }

  // Duplicate entry (unique constraint)
  if (
    errorCode === 'ER_DUP_ENTRY' ||
    errorMessage.includes('Duplicate entry')
  ) {
    return {
      statusCode: 400,
      message: 'This record already exists. Please use a unique value.'
    };
  }

  // NOT NULL constraint
  if (
    errorCode === 'ER_BAD_NULL_ERROR' ||
    errorMessage.includes('NOT NULL') ||
    errorMessage.includes('not null')
  ) {
    return {
      statusCode: 400,
      message: 'Required field is missing. Please provide all necessary information.'
    };
  }

  // Generic database error fallback
  return {
    statusCode: 500,
    message: 'A database error occurred. Please try again later.'
  };
};

module.exports = { ErrorHandler, errorMiddleware };