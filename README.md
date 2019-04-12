# Simple Custom Errors for NodeJS

Description
-------------
This simple Node.js package is used for creating custom errors for better error handling in Node.js. It supports custom error codes, descriptions, variables and it offers Sentry support!
It also contains some handlers for [ExpressJS](https://expressjs.com) and [Sentry](https://sentry.io).

Installation and Usage
-------------
To install the custom errors package, simply install via npm or yarn
```
npm install --save simple-custom-errors
```

Setup and usage of the custom errors package follows the same principle.
```javascript
const CustomErrors = require("custom-errors");

CustomErrors.createError("FooError", [
  {
    code: "Bar",
    description: "Bar '{{foo}}' Error",
    details: [
      "foo"
    ],

    // Support for Sentry, but you have to use the SentrySendEvent handler!
    sentry: {
      send: true,   // Send error to sentry (true/false)
      level: "info" // Sentry error level (fatal/error/warning/info/debug)
    }
  }
]);

throw new CustomErrors.Errors.FooError("FooError", {foo: "bar"});
```

Documentation
-------------

#### Creating an error
Creating an error can be done by using the ```createError(name, errorList = [])``` function.

**Example**
```javascript
const CustomError = require("custom-errors");

CustomError.createError("ErrorName", [
  {
    code: "ErrorCode",
    description: "Error description with {{details}}",
    details: [
      "details"
    ],
    sentry: {
      send: true,     
      level: "error"  
    }
  }
])
```

#### Using a custom error
When an error is created, it's time to use such an error. This can be done in two ways.

**Example**
```javascript
// Use the CustomError variable
const CustomError = require("custom-errors");
throw new CustomError.Errors.ErrorName("ErrorCode", { variable: "foo" });

// Use the Errors directly
const Errors = require("custom-errors").Errors;
throw new Errors.ErrorName("ErrorCode", { variable: "foo" });
```

_This library is a work in progress, there isn't much more functionality than this..._

Handlers
-------------
This library has some custom handlers. Not only for the custom errors, but also for some other libraries like ```request-promise``` or ```node-mysql```.
The different handlers all have their own special talent. Some make the errors beautiful, but some just takes some extra work out of your hands.

**Prettify Errors _(Express.js)_**

This handler is used to prettify errors for the ExpressJS response.
```javascript
const express = require("express");
const CustomError = require("custom-errors");

CustomError.createError("ErrorName", [
  {
    code: "ErrorCode",
    description: "Error description with {{details}}",
    details: [
      "variables"
    ],
    sentry: {
      send: true,     
      level: "error"  
    }
  }
])

const app = express();

// Use this handler after the configured requests, because it's an error handler (obviously)
app.use(CustomError.Handlers.PrettifyErrors);

app.use((error, req, res, next) => {
  // Use the error here!
  res.json({
    message: error.message,
    description: error.description,
    details: error.details
  })

})

app.listen(8080, () => {
  console.log(`Port 8080 is the magic port!`);
})
```

**Sentry Preparation + SentrySendEvent _(Express.js + @sentry/node)_**

Prepare errors for Sentry (works best with the PrettifyErrors handler). You have to use the SentrySendEvent handler in order for it to work!
```javascript
const express = require("express");
const Sentry = require("@node/sentry");
const CustomError = require("custom-errors");

Sentry.init({
  dns: "___DSN___",
  beforeSend: (event, hint) => {
    event = CustomError.Handlers.SentrySendEvent(event, hint);
    return event;
  }
})

CustomError.createError("ErrorName", [
  {
    code: "ErrorCode",
    description: "Error description with {{details}}",
    details: [
      "variables"
    ],
    sentry: {
      send: true,     
      level: "error"  
    }
  }
])

const app = express();

// Use this handler after the configured requests, because it's an error handler (obviously)
app.use(CustomError.Handlers.PrettifyErrors);

// Use this handler after the PrettifyErrors
app.use(CustomError.Handlers.SentryPreparation);

app.use((error, req, res, next) => {
  // Use the error here!
  res.json({
    message: error.message,
    description: error.description,
    details: error.details
  })

})

app.listen(8080, () => {
  console.log(`Port 8080 is the magic port!`);
})
```

**API Response _(Express.js)_**

Send the API response automatically with the API Response handler. This can't be configured at the moment, but it's a work in progress! Use this with the PrettifyErrors handler for the best experience!

```javascript
const express = require("express");
const CustomError = require("custom-errors");

CustomError.createError("ErrorName", [
  {
    code: "ErrorCode",
    description: "Error description with {{details}}",
    details: [
      "variables"
    ],
    sentry: {
      send: true,     
      level: "error"  
    }
  }
])

const app = express();

// Use this handler after the configured requests, because it's an error handler (obviously)
app.use(CustomError.Handlers.PrettifyErrors);

// Use this handler as last handler, because this sends the response!
app.use(CustomError.Handlers.APIResponse);

app.listen(8080, () => {
  console.log(`Port 8080 is the magic port!`);
})
```

Support
-------------
If you're having any problems or want some new features, please raise an issue!


_This README is a work in progess_
