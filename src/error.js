export default class CustomError extends Error {
  constructor (code, params = {}) {
    super(code);

    this.code = code;
    this.message = code;

    this.params = null;

    // HTTP options
    this.http = {
      statusCode: 500,
    };

    // Sentry options
    this.sentry = {
      send: true,
      level: 'error',
    };

    // Configure error
    this.configureError(params);
  }

  // Getters
  get httpStatusCode () {
    // Get http statusCode from http.statusCode or set 500 as default
    return (this.http && typeof this.http.statusCode === 'number' ? this.http.statusCode : 500);
  }

  get apiError () {
    // Format error to an JSON API response
    const apiError = {
      error: (this.type || 'error'),
      code: this.code,
      message: this.message,
    };

    // Add params, if set
    if (this.params) {
      apiError.params = this.params;
    }

    return apiError;
  }

  get sendToSentry () {
    // Check if sentry itself is a boolean
    if (typeof this.sentry === 'boolean') {
      return this.sentry;
    }

    // Check if send is a boolean
    if (this.sentry && typeof this.sentry.send === 'boolean') {
      return this.sentry.send;
    }

    // Always send to sentry by default
    return true;
  }

  // Methods
  configureError (_params = {}) {
    return this;
  }
}
