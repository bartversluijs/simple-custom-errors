const createError = require("./models/createError");

const CustomError = require("./errors/_custom");
const ErrorModule = require("./errors/_module");

const PrettifyErrors = require("./handlers/PrettifyErrors");
const SentryPreparation = require("./handlers/SentryPreparation");
const APIResponse = require("./handlers/APIResponse");

const SentrySendEvent = require("./handlers/SentrySendEvent");

// Execute function to check installed modules
require("./util/InstalledModules");

module.exports = {
  createError: createError,

  CustomError: CustomError,
  Errors: ErrorModule.Errors,
  Handlers: {
    PrettifyErrors,
    SentryPreparation,
    APIResponse,

    SentrySendEvent
  },
  Util: {
    PrettifyErrors: require("./util/PrettifyErrors"),
    SentryPreparation: require("./util/SentryPreparation"),
    APIResponse: require("./util/APIResponse")
  }
};
