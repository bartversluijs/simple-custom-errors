import SimpleCustomErrors from '../lib/index';

// Create FooError
SimpleCustomErrors.createError('FooError', [
  {
    code: 'Bar',
    description: 'Bar Error',
    params: [
      'foo',
    ],
  },
]);

throw new SimpleCustomErrors.Errors.FooError('Bar', {
  foo: ['Test'],
});
