// Classes
import CustomError from './error';

// Variables
const Errors = {};

export default {
  CustomError,
  Errors,
  createError (name = null, subErrors = []) {
    // Check if name is given
    if (!name) {
      throw new CustomError('Error name undefined');
    }

    // Check if name already exists
    if (typeof Errors[name] !== typeof undefined) {
      throw new CustomError(`Error '${name}' already exists`);
    }

    // Add error to Errors object
    Errors[name] = class NewError extends CustomError {
      constructor (code, params = {}) {
        super();

        this.code = code;
        this.message = code;

        this.params = null;
        this.sentry = null;

        // Configure error
        this.configureError(params);
      }

      configureError (params = {}) {
        const subError = Errors[name].subErrors.find((error) => error.code === this.code);
        if (!subError) {
          return this;
        }

        // Set sentry
        this.sentry = (subError.sentry || null);

        // Set params
        if (subError.params && Array.isArray(subError.params)) {
          this.params = {};
          subError.params.forEach((key) => {
            this.params[key] = (params[key] || null);
          });
        }

        // Set description
        this.message = (subError.description || this.message);

        // Convert variables in message to keys
        let regexMatch;
        do {
          regexMatch = new RegExp(/{{(.*?)}}/g).exec(this.message);
          if (regexMatch && this.params[regexMatch[1]]) {
            let replaceValue = this.params[regexMatch[1]];

            // Check if Array or Object, so we can stringify the value
            if (typeof replaceValue === 'object' || Array.isArray(replaceValue)) {
              replaceValue = JSON.stringify(replaceValue);
            }

            // Replace message variable with replaceValue
            this.message = this.message.replace(new RegExp(regexMatch[0], 'g'), replaceValue);
          }
        } while (regexMatch);
        return this;
      }
    };

    // Add sub-errors
    Errors[name].subErrors = subErrors;

    // Give the error the right name
    Object.defineProperty(Errors[name], 'name', { value: name });
    Errors[name].prototype.name = name;

    return Errors[name];
  },
};
