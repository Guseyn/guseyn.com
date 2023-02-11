'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is json or null (in case of parsing error)
class SafeParsedJSON extends AsyncObject {
  constructor (string) {
    super(string)
  }

  syncCall () {
    return (string) => {
      if (typeof string === 'object') {
        return string
      }
      try {
        return JSON.parse(string)
      } catch (error) {
        return null
      }
    }
  }
}

module.exports = SafeParsedJSON
