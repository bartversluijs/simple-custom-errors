export default class CustomError extends Error {
  constructor (code, params = {}) {
    super(code);

    this.code = code;
    this.message = code;

    this.params = null;
    this.sentry = null;

    // HTTP options
    this.http = {
      code: 500,
    };

    // Configure error
    this.configureError(params);
  }

  configureError (_params = {}) {
    return this;
  }
}
