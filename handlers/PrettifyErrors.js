// Use this handler to prettify errors from multiple modules
const PrettifyErrors = require("../util/PrettifyErrors");

module.exports = (error, req, res, next) => {
  if(error) {
    error = PrettifyErrors(error);
  }

  next(error);
}
