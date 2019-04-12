module.exports = (event, hint) => {

  let Sentry = null;
  try {
    Sentry = require("@sentry/node");
  } catch(e) {
    console.warn("CustomErrors WARNING: Sentry Node.JS SDK is not installed, please install this SDK first before using the SentrySendEvent handler");
  }

  if(Sentry !== null) {
    if(event.hasOwnProperty("exception")) {
      // captureException used OR Express Handler captured it

      let indexOfLastException = event.exception.values.length - 1;

      const error = hint.originalException;
      if(typeof error !== typeof undefined) {

        if(error.hasOwnProperty("_sentry")) {

          let sendEvent = true;
          if(error._sentry.hasOwnProperty("send") && error._sentry.send === false) {
            sendEvent = false;
          }

          if(sendEvent === true) {
            if(error._sentry.hasOwnProperty("message")) { event.exception.values[indexOfLastException].type = error._sentry.message; }
            if(error._sentry.hasOwnProperty("level")) { event.level = Sentry.Severity.fromString(error._sentry.level); }
            if(error._sentry.hasOwnProperty("extra")) {
              Object.keys(error._sentry.extra).forEach(key => {
                event.extra[key] = error._sentry.extra[key];
              })
            }
          } else {
            event = null;
          }

        }

      }

    } else {

    }
  }

  return event;

}
