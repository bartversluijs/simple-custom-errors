import SimpleCustomErrors from '../build/index';

// Create FooError
const FooError = SimpleCustomErrors.createError('FooError', [
  {
    code: 'Bar',
    description: 'Bar {{foo}}',
    params: [
      'foo',
    ],
  },
]);

try {
  // Throw error
  throw new SimpleCustomErrors.Errors.FooError('Bar', {
    foo: ['Test'],
  });
} catch (e) {
  // Handling the error nicely
  // We can check if it's a default javascript, because it's based on top of the default javascript error
  if (e instanceof Error) {
    console.log('It\'s a default javascript error!');
  }

  // We can also check if it's an error from the SimpleCustomErrors like this
  if (e instanceof SimpleCustomErrors.Error) {
    console.log('It\'s an SimpleCustomErrors Error!');
  }

  // But, for more detailed error handling, we can also check if it's the FooError we've just created
  if (e instanceof FooError) {
    console.log('It\'s our created custom FooError!');
  }

  // Last but not least, we have the following fields available for more detailed error handling
  console.log(`Type: ${e.type}`); // The error (FooError)
  console.log(`Code: ${e.code}`); // The suberror code (Bar)
  console.log('Params:', e.params); // The params of the suberror ({foo: ['Test']})
}
