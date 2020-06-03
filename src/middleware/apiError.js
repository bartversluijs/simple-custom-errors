// Libraries
import CustomError from '../error';

export default (error, _req, res, next) => {
  // If not instanceof CustomError, just send to next error handler
  if (error instanceof CustomError === false) {
    next(error);
  }

  // If it is a CustomError, handle the error
  // Set HTTP(s) Status code
  res.status(error.httpStatusCode);

  // Set jsonError
  const jsonError = error.apiError;

  // Add Sentry error_tracking
  if (res.sentry) {
    jsonError.error_tracking = res.sentry;
  }

  // Return formatted jsonError
  return res.json(jsonError);
};
