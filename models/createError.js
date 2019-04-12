const ConfigureError = require("../util/ConfigureError");

const _customError = require("../errors/_custom");

module.exports = (name, list = []) => {
  let existingErrors = require("../errors/_module");
  if(!existingErrors.hasOwnProperty(name)) {


    existingErrors._errors[name] = list;
    existingErrors.Errors[name] = class extends _customError {
      constructor(code, details = {}) {
        super(code);

        this._code = code;
        this.message = code;

        this._details = details;

        this.details = {};
        this.sentry = null;

        ConfigureError(this, existingErrors._errors[name]);

        delete this._details;
      }
    };

    Object.defineProperty(existingErrors.Errors[name], "name", { value: name });
    existingErrors.Errors[name].prototype.name = name;

    return existingErrors.Errors[name];
  } else {
    throw new _customError("Error " + name + " already exists");
  }
}
