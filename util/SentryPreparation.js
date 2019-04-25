// Use this handler when using Sentry, to get prettified errors in Sentry
const CustomError = require("../errors/_custom");

let installedModules = require("../util/InstalledModules");

module.exports = (error) => {
  if(error) {

    error._sentry = {};
    error._sentry.send = true;
    error._sentry.level = null;
    error._sentry.extra = {};

    if(typeof error !== typeof undefined && typeof error.constructor !== typeof undefined) {

      if(error instanceof CustomError) {

        error._sentry.message = "[" + error.name + "] " + error.code + " - " + error.message;

        if(error.hasOwnProperty("sentry") && error.sentry !== null) {
          if(error.sentry.hasOwnProperty("send") && (error.sentry.send === true || error.sentry.send === false)) { error._sentry.send = error.sentry.send; }
          if(error.sentry.hasOwnProperty("level")) { error._sentry.level = error.sentry.level; }
        }

        if(error.hasOwnProperty("details")) {
          error._sentry.extra = error.details;
        }

      } else if(installedModules.indexOf("request-promise") !== -1 && error instanceof require('request-promise/errors').RequestError) {
        error._sentry.message = "[REQUEST ERROR] " + error.message;
      } else if(error instanceof Error) {

        if(error.hasOwnProperty("sql") || error.hasOwnProperty("sqlState") || error.hasOwnProperty("sqlMessage")) {
          // MySQL Error
          error._sentry.message = "[MYSQL ERROR] " + error.code + " (#" + error.errno + ") - " + error.sqlMessage;

          error._sentry.extra.mysqlError = {
            number: error.errno,
            code: error.code,
            sql: error.sql,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
          }
        } else {
          error._sentry.message = error.message;
        }

      }

    }

  }

  next(error);
}
