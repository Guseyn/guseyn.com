'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is response
class EndedResponse extends AsyncObject {
  constructor (response, data, encoding) {
    super(response, data, encoding || 'utf8')
  }

  asyncCall () {
    return (response, data, encoding, callback) => {
      this.response = response
      if (!response.writableEnded && !response.destroyed) {
        response.end(data, encoding, callback)
      } else {
        callback(null, response)
      }
    }
  }

  onResult () {
    return this.response
  }
}

module.exports = EndedResponse
