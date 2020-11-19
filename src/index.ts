// Classes
import CustomError, { Code, SentryConfig, HTTPConfig } from './error';

// Middleware
import apiError from './middleware/apiError';

export {
  CustomError as SimpleCustomError
};

export interface SubError {
  code: string;
  description: string;
  params?: string[];
  http?: HTTPConfig;
  sentry?: SentryConfig;
}

export default class SimpleCustomErrors {
  static Error = CustomError;

  static Errors: Record<string, any> = {};

  static Middleware: Record<string, any> = {
    apiError
  };

  static createError (type: string, subErrors?: SubError[]) {
    // Check if name is given
    if (!type) {
      throw new CustomError('Error type undefined');
    }

    // Check if name already exists
    if (typeof SimpleCustomErrors.Errors[type] !== typeof undefined) {
      throw new CustomError(`Error '${type}' already exists`);
    }

    // Add error to Errors object
    class UndefinedError extends CustomError {
      constructor (code: Code, params?: Record<string, any>) {
        super(code, params);

        // Set type
        this.type = type;
      }

      configureError (params?: Record<string, any>): this {
        const subError: SubError = SimpleCustomErrors.Errors[type]?.subErrors?.find((error: CustomError) => error.code === this.code);
        if (!subError) {
          return this;
        }

        // Set params
        if (subError.params && Array.isArray(subError.params)) {
          subError.params.forEach((key: string) => {
            // Create params if they don't exist
            if (!this.params) {
              this.params = {};
            }

            // Set params to given key or null
            this.params[key] = (params && params[key] ? params[key] : null);
          });
        }

        // Set description
        this.message = (subError.description || this.message);

        // Set HTTP code
        this.http = (subError.http || this.http);

        // Set sentry
        this.sentry = (typeof subError.sentry !== typeof undefined ? subError.sentry : this.sentry);

        // Convert variables in message to keys
        Object.keys(this.params || []).forEach((key: string) => {
          this.message = this.message.replace(new RegExp(`{{${key}}}`, 'g'), (this.params && this.params[key] ? this.params[key] : undefined));
        });

        return this;
      }
    }

    // Add sub-errors
    SimpleCustomErrors.Errors[type] = UndefinedError;
    SimpleCustomErrors.Errors[type].subErrors = subErrors;

    // Give the error the right name
    Object.defineProperty(SimpleCustomErrors.Errors[type], 'name', { value: type });
    SimpleCustomErrors.Errors[type].prototype.name = type;

    return SimpleCustomErrors.Errors[type];
  }
}
