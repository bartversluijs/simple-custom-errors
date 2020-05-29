# Simple Custom Errors for NodeJS

> **Caution**
> This library is created alongside some private projects.
> Because of this,some functionality can be changed if it doesn't work easy enough
> _Of course, everyone is more than welcome to help or create issues!_

Description
-------------
This simple Node.js package is used for creating custom errors for better error handling in Node.js. It supports custom error codes, descriptions and variables. This along with some useful API formatters.
It also has some easy to use middleware.

Installation and Usage
-------------
To install the custom errors package, simply install via npm or yarn
```
npm install --save simple-custom-errors
```

Setup and usage of the custom errors package follows the same principle.
```javascript
import SimpleCustomErrors from 'simple-custom-errors';

SimpleCustomErrors.createError('FooError', [
  {
    code: 'Bar',
    description: 'Bar \'{{foo}}\'',
    details: [
      'foo'
    ],
  }
]);

throw new CustomErrors.Errors.FooError('FooError', {foo: 'bar'});
```

Documentation
-------------

#### Creating an error
Creating an error can be done by using the ```createError(name, errorList = [])``` function.

**Example**
```javascript
import SimpleCustomErrors from 'simple-custom-errors';

SimpleCustomErrors.createError("ErrorName", [
  {
    code: 'ErrorCode',
    description: 'Error description with {{details}}',
    details: [
      'details'
    ],
  }
])
```

#### Using a custom error
When an error is created, it's time to use such an error. This can be done in two ways.

**Example**
```javascript
// Use the CustomError variable
import SimpleCustomErrors from 'simple-custom-errors';
throw new SimpleCustomErrors.Errors.ErrorName('ErrorCode', { variable: 'foo' });

// Use the Errors directly
import { Errors } from 'simple-custom-errors';
throw new Errors.ErrorName('ErrorCode', { variable: 'foo' });
```

_This library is a work in progress, there isn't much more functionality than this..._

Examples
-------------
There are some examples in the 'examples' directory. Feel free to take a look!

Support
-------------
If you're having any problems or want some new features, please raise an issue!


_This README is a work in progess_
