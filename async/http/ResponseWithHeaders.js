'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is response
class ResponseWithHeaders extends AsyncObject {
  constructor (response, headers) {
    super(response, headers)
  }

  syncCall () {
    return (response, headers) => {
      for (let name in headers) {
        response.setHeader(name, headers[name])
      }
      return response
    }
  }
}

module.exports = ResponseWithHeaders
