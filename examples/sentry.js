import Sentry from '@sentry/node';

import SimpleCustomErrors from '../src/index';

// Create FooError
SimpleCustomErrors.createError('FooError', [
  {
    code: 'Bar',
    description: 'Bar {{foo}}',
    params: [
      'foo',
    ],
    http: {
      statusCode: 404,
    },
    sentry: {
      send: true,
      level: 'warning',
    },
  },
  {
    code: 'Foo',
    description: 'Foo {{bar}}',
    params: [
      'bar',
    ],
    http: {
      statusCode: 500,
    },
    sentry: {
      send: true,
      level: 'error',
    },
  },
  {
    code: 'NoSentry',
    description: 'Error, but not for Sentry',
    params: [],
    http: {
      statusCode: 404,
    },
    sentry: false,
  },
]);

// Throw error
try {
  throw new SimpleCustomErrors.Errors.FooError('NoSentry');
} catch (e) {
  // This will log the error
  console.error(e);

  // This will create a JSON of the error, so we can send it back via an API or something
  // It'll be useful when you're relying on this module in an API project, and every error returns the same structure
  // Every error will have this apiError, so no need for extra configuration
  console.error(e.apiError);

  /*
    Structure of the API Error:
    - error: The error (in this case 'FooError')
    - code: The suberror (in this case 'Bar')
    - message: The description of the suberror (In this case 'Bar ['test']')
    - Params: The given params (In this case '{foo: ['Test']}')
  */

  // Even an HTTP status code is implemented
  // This can be optained like this
  // By default this code is 500, but in the error we've created it's changed to 404
  console.error('HTTP Status code', e.httpStatusCode);

  // You can check if the error is going to Sentry by using the sendToSentry getter
  // This way, you can create a handler in Sentry based on this
  // By default, this is always true
  console.error('Send to Sentry', e.sendToSentry);
}

// Sentry handler
// If an error has been thrown, Sentry will capture this error
// But we'd like Sentry to work together with this library
// This is easier said than done
// But luckily, you've came accross this example, which explains two ways how to do this

// The Sentry client method
// You've to create a client in order for this to work, like this
Sentry.init({
  dsn: '__DSN__',
  beforeSend (event, hint) {
    // The event is the one that's going to be sent to Sentry
    // We'd like to check the 'hint', because this is the stacktrace of the error we've thrown somewhere

    // First, we've to check if it's a SimpleCustomError
    if (hint instanceof SimpleCustomErrors.Error) {
      // Then, we've to check if the error has to be sent to Sentry
      // If not, return null, so Sentry won't send the event
      if (hint.sendToSentry === false) {
        return null;
      }

      // You can do some other SimpleCustomError related stuff here, because we've determined that the error is going to be sent to Sentry
    }

    // Return the event here, so Sentry will send it to the specified DSN
    return event;
  },
});

// The Sentry Express Error Handler
// Sentry also has an Express Error Handler (https://sentry.io/for/express/)
// The main difference is that this way, we only handle the errors catched by Express, and not in the whole Node.js software
// We'll only focus on the errorHandler, because you can lookup the other stuff at the link above
// Something that isn't documented very well, is the shouldHandleError part of the errorHandler
// This can be initialized like this
Sentry.Handlers.errorHandler({
  shouldHandleError (error) {
    // This is going to be the same as above, like the Sentry client method
    // Only this time, it's only applied to the Express part of your software

    // First, we've to check if it's a SimpleCustomError
    if (error instanceof SimpleCustomErrors.Error) {
      // Then, we've to check if the error has to be sent to Sentry
      // If not, return false, so the middleware knows it has to be sent to Sentry
      if (error.sendToSentry === false) {
        return false;
      }

      // You can do some other SimpleCustomError related stuff here, because we've determined that the error is going to be sent to Sentry
    }

    // Return true here, because if it reaches the bottom, nothing has stopped it from handling the error
    return true;
  },
});
