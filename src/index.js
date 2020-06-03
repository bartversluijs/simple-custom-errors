// Classes
import CustomError from './error';

// Middleware
import apiError from './middleware/APIError';

// Variables
export const Errors = {};

export default {
  Error: CustomError,

  Errors,
  Middleware: {
    apiError,
  },
  createError (type = null, subErrors = []) {
    // Check if name is given
    if (!type) {
      throw new CustomError('Error type undefined');
    }

    // Check if name already exists
    if (typeof Errors[type] !== typeof undefined) {
      throw new CustomError(`Error '${type}' already exists`);
    }

    // Add error to Errors object
    Errors[type] = class extends CustomError {
      constructor (code, params = {}) {
        super(code, params);

        // Set type
        this.type = type;
      }

      configureError (params = {}) {
        const subError = Errors[type].subErrors.find((error) => error.code === this.code);
        if (!subError) {
          return this;
        }

        // Set params
        if (subError.params && Array.isArray(subError.params)) {
          this.params = {};
          subError.params.forEach((key) => {
            this.params[key] = (params[key] || null);
          });
        }

        // Set description
        this.message = (subError.description || this.message);

        // Set HTTP code
        this.http = (subError.http || this.http);

        // Set sentry
        this.sentry = (typeof subError.sentry !== typeof undefined ? subError.sentry : this.sentry);

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
    Errors[type].subErrors = subErrors;

    // Give the error the right name
    Object.defineProperty(Errors[type], 'name', { value: type });
    Errors[type].prototype.name = type;

    return Errors[type];
  },
};
