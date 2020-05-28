export default class CustomError extends Error {
  constructor (code, params = {}) {
    super(code);

    this.code = code;
    this.message = code;

    this.params = null;
    this.sentry = true;

    // HTTP options
    this.http = {
      statusCode: 500,
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

  // Methods
  configureError (_params = {}) {
    return this;
  }
}
