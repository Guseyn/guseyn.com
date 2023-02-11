'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const assert = require('assert')

// Represented result is actual value (for further using)
class DeepStrictEqualAssertion extends AsyncObject {
  constructor (actual, expected, message) {
    super(actual, expected, message)
  }

  syncCall () {
    return (actual, expected, message) => {
      assert.deepStrictEqual(actual, expected, message)
      return actual
    }
  }
}

module.exports = DeepStrictEqualAssertion
