import SimpleCustomErrors from '../build/index';

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
  },
]);

// Throw error
try {
  throw new SimpleCustomErrors.Errors.FooError('Bar', {
    foo: ['Test'],
  });
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
}
