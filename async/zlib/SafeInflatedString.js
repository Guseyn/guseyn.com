'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const zlib = require('zlib')

class SafeInflatedString extends AsyncObject {
  constructor (data, defaultValue, options) {
    super(data, defaultValue, options || {})
    this.defaultValue = defaultValue
  }

  asyncCall () {
    return (data, defaultValue, options, callback) => {
      zlib.inflate(new Uint8Array(Buffer.from(data, 'base64')), options, callback)
    }  
  }

  onErrorAndResult (error, result) {
    if (error) {
      return this.defaultValue
    }
    return result.toString()
  }

  continueAfterFail () {
    return true
  }
}

module.exports = SafeInflatedString
