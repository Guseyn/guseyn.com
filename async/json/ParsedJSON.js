'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is json
class ParsedJSON extends AsyncObject {
  constructor (string) {
    super(string)
  }

  syncCall () {
    return (string) => {
      try {
        return JSON.parse(string)
      } catch (error) {
        return null
      }
    }
  }
}

module.exports = ParsedJSON
