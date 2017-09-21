'use strict'
module.exports = function parallelMiddleware (middlewares, options) {
  var opts = options || {}
  return function (req, res, next) {
    var completed = false
    var pending = middlewares.length
    var timeout
    if (typeof opts.timeout === 'number') {
      timeout = setTimeout(function () {
        complete(new Error('parallel middleware timeout reached'))
      }, opts.timeout)
    }

    for (var i = 0; i < pending; i++) {
      middlewares[i](req, res, onProgress)
    }

    function onProgress (err) {
      pending--
      if (err) {
        return complete(err)
      }
      if (pending === 0) {
        complete()
      }
    }

    function complete (err) {
      if (completed) {
        return
      }
      completed = true
      clearTimeout(timeout)
      next(err)
    }
  }
}
