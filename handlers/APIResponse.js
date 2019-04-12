// Use this as last error handler when using API requests
module.exports = (error, req, res, next) => {
  if(error instanceof Error) {

    res.status(error.statusCode || 500);

    let response = {
      error: error.message,
      description: error.description
    }

    if(error.hasOwnProperty("details") && Object.keys(error.details).length > 0) {
      response.details = error.details;
    }

    if(res.hasOwnProperty("sentry") && res.sentry.length > 0) {
      response.tracking_id = res.sentry;
    }

    res.json(response);

  } else {
    res.json(err);
  }
}
