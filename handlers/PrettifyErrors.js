// Use this handler to prettify errors from multiple modules
const ErrorModule = require("../errors/_module");

let installedModules = require("../util/InstalledModules");

module.exports = (error, req, res, next) => {
  if(error) {

    if(typeof error !== typeof undefined && typeof error.constructor !== typeof undefined) {

      if(error instanceof ErrorModule.GeneralError || error instanceof ErrorModule.ProvisioningError) {

        if(error.hasOwnProperty("details") && error.details.hasOwnProperty("additional")) {

          if(installedModules.indexOf("request-promise") !== -1 && error.details.additional instanceof require("request-promise/errors").StatusCodeError) {

            if(error.details.additional.hasOwnProperty("response")) {
              error.details.additional = {
                statusCode: error.details.additional.response.statusCode,
                body: error.details.additional.response.body
              }
            }

          }

        }

      } else if(installedModules.indexOf("request-promise") !== -1 && error instanceof require("request-promise/errors").RequestError) {
        error.description = error.message;
        error.message = error.name;
      } else if(error instanceof Error) {
        if(error.hasOwnProperty("sql") || error.hasOwnProperty("sqlState") || error.hasOwnProperty("sqlMessage")) {
          // MySQL Error
          error.message = error.code;
          error.description = error.sqlMessage;
          error.details = {
            errno: error.errno
          }
        } else {
          // Nothing to do for regular errors
        }
      }

    }

  }

  next(error);
}
