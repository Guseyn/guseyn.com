'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const assert = require('assert')

// Represented result is value (for further using)
class Assertion extends AsyncObject {
  constructor (value, message) {
    super(value, message)
  }

  syncCall () {
    return (value, message) => {
      assert(value, message)
      return value
    }
  }
}

module.exports = Assertion
