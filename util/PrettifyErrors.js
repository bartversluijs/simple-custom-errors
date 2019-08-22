"use strict"

const CustomError = require("../errors/_custom");

let installedModules = require("../util/InstalledModules");

module.exports = (error) => {
  if(error) {

    if(typeof error !== typeof undefined && typeof error.constructor !== typeof undefined) {

      if(error instanceof CustomError) {

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
        error.code = error.name;
      } else if(error instanceof Error) {
        if(error.hasOwnProperty("sql") || error.hasOwnProperty("sqlState") || error.hasOwnProperty("sqlMessage")) {
          // MySQL Error
          error.message = error.sqlMessage;
          error.details = {
            errno: error.errno
          }
        } else {
          // Nothing to do for regular errors
        }
      }

    }

  }

  return error;
}
