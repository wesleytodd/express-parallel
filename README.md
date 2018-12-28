# Run middleware in parallel

[![NPM Version](https://img.shields.io/npm/v/parallel-middleware.svg)](https://npmjs.org/package/parallel-middleware)
[![NPM Downloads](https://img.shields.io/npm/dm/parallel-middleware.svg)](https://npmjs.org/package/parallel-middleware)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

Run express style middleware in parallel, that's all.

Will call `next` only once, either on the first encountered error, the (optional) timeout is reached, or
all of the middleware have called their own `next`.

## Install

```
$ npm install --save parallel-middleware
```

## Usage

```javascript
var parallel = require('parallel-middleware')
var app = require('express')()

app.use(parallel([
  middleware1,
  middleware2,
  middleware3
]), function (req, res) {
  // Middleware ran without error
  res.status(204)
}, funciton (err, req, res, next) {
  // An error occured in one of the middleware
  res.status(500)
})

// Run parallel with a timeout of 5 seconds
app.use(parallel([
  middleware1,
  middleware2,
  middleware3
], {
  timeout: 5000
}))
```

*Credit where credit is due, this was originally a fork of [Hunter Loftis' package](https://github.com/hunterloftis/express-parallel).  I have changed a bunch, including the package name.*
