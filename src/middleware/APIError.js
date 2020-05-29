// Libraries
import CustomError from '../error';

export default (error, _req, res, next) => {
  // If not instanceof CustomError, just send to next error handler
  if (error instanceof CustomError === false) {
    next(error);
  }

  // If it is a CustomError, handle the error
  // Set HTTP Status code
  res.status(error.httpStatusCode);

  return res.json(error.apiError);
};
