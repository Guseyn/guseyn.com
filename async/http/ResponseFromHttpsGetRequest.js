'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const responseFromHttpsGetRequest = require('./custom-calls/responseFromHttpsGetRequest')

// Represented result is {statusCode, headers, body}
class ResponseFromHttpsGetRequest extends AsyncObject {
  constructor (options) {
    super(options)
  }

  asyncCall () {
    return (options, callback) => {
      return responseFromHttpsGetRequest(options, callback)
    }
  }
}

module.exports = ResponseFromHttpsGetRequest
