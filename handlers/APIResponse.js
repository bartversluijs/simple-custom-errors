// Use this as last error handler when using API requests
const APIResponse = require("../util/APIResponse");

module.exports = (error, req, res, next) => {
  if(error instanceof Error) {

    res.status(error.statusCode || 500);

    let response = APIResponse(error);

    if(res.hasOwnProperty("sentry") && res.sentry.length > 0) {
      response.tracking_id = res.sentry;
    }

    res.json(response);

  } else {
    res.json(err);
  }
}
