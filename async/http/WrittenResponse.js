'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is response
class WrittenResponse extends AsyncObject {
  constructor (response, chunk, encoding) {
    super(response, chunk, encoding || 'utf8')
  }

  asyncCall () {
    return (response, chunk, encoding, callback) => {
      this.response = response
      if (!response.writableEnded && !response.destroyed) {
        response.write(chunk, encoding, callback)
      } else {
        callback(null, response)
      }
    }
  }

  onResult () {
    return this.response
  }
}

module.exports = WrittenResponse
