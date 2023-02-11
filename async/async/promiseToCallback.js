'use strict'

const isFunction = (value) => {
  const type = Object.prototype.toString.call(value)

  return (type === '[object Function]') ||
    (type === '[object GeneratorFunction]') ||
    (type === '[object AsyncFunction]')
}

module.exports = (promise) => {
  if (!isFunction(promise.then)) {
    throw new TypeError('Expected a promise')
  }

  return (callback) => {
    promise.then(
      (data) => {
        setImmediate(callback, null, data)
      },
      (error) => {
        setImmediate(callback, error)
      }
    )
  }
}
