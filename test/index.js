/* global describe, it */
var assert = require('assert')
var parallel = require('../')

// A middleware function
function makeMiddleware (time, err) {
  return function mw (req, res, next) {
    req.called = (req.called || 0) + 1
    setTimeout(function () {
      req.finished = (req.finished || 0) + 1
      next(err)
    }, time)
  }
}

describe('parallel-middleware', function () {
  it('should call them in parallel', function (done) {
    var req = {}
    parallel([makeMiddleware(), makeMiddleware(), makeMiddleware()])(req, null, function () {
      assert.equal(req.called, 3)
      assert.equal(req.finished, 3)
      done()
    })
  })
  it('should timeout', function (done) {
    var req = {}
    parallel([makeMiddleware(), makeMiddleware(100), makeMiddleware(100)], {
      timeout: 50
    })(req, null, function (err) {
      assert(err)
      assert.equal(req.called, 3)
      assert.equal(req.finished, 1)
      done()
    })
  })
  it('should error', function (done) {
    var req = {}
    parallel([makeMiddleware(), makeMiddleware(25, new Error('test')), makeMiddleware(50)])(req, null, function (err) {
      assert(err)
      assert.equal(req.called, 3)
      assert.equal(req.finished, 2)
      done()
    })
  })
})
