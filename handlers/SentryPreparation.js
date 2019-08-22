"use strict"

// Use this handler when using Sentry, to get prettified errors in Sentry
const SentryPreparation = require("../util/SentryPreparation");

module.exports = (error, req, res, next) => {
  if(error) {
    error = SentryPreparation(error);
  }

  next(error);
}
