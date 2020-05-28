export default class CustomError extends Error {
  constructor (code, _details = {}) {
    super();

    this.code = code;
    this.message = code;

    this.params = null;
    this.sentry = null;
  }
}
