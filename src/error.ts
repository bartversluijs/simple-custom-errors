export type Code = string | undefined;

export interface APIError {
  error: string;
  code: Code,
  message: string;
  params: Record<string, any>
}

export type SentryConfig = boolean | {
  send: true;
  level: 'error';
}

export type HTTPConfig = {
  statusCode: number;
}

export default class CustomError extends Error {
  type: string;
  code: Code;
  message: string;
  params?: Record<string, any>;
  http?: HTTPConfig;
  sentry?: SentryConfig;

  constructor (code: Code, params?: Record<string, any>) {
    super(code);

    // Set default data
    this.type = 'UnknownError';
    this.message = 'Undefined message';
    this.code = code;

    // HTTP options
    this.http = {
      statusCode: 500,
    }

    // Sentry options
    this.sentry = {
      send: true,
      level: 'error'
    }

    // Configure error
    this.configureError(params);
  }

  // Getters
  get httpStatusCode (): number {
    // Get http statusCode from http.statusCode or set 500 as default
    return (this.http && typeof this.http.statusCode === 'number' ? this.http.statusCode : 500);
  }

  get apiError (): APIError  {
    // Format error to an JSON API response
    const apiError: APIError = {
      error: (this.type || 'error'),
      code: this.code,
      message: this.message,
      params: {}
    };

    // Add params, if set
    if (this.params) {
      apiError.params = this.params;
    }

    return apiError;
  }

  get sendToSentry (): boolean {
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
  configureError (_params?: Record<string, any>): this {
    return this;
  }
}
