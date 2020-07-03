import SimpleCustomErrors from '../build/index';

// Create FooError
SimpleCustomErrors.createError('FooError', [
  {
    code: 'Bar',
    description: 'Bar {{foo}}',
    params: [
      'foo',
    ],
  },
]);

// Throw error
throw new SimpleCustomErrors.Errors.FooError('Bar', {
  foo: ['Test'],
});
