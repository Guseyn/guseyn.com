'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is response
class ResponseWithHeader extends AsyncObject {
  constructor (response, name, value) {
    super(response, name, value)
  }

  syncCall () {
    return (response, name, value) => {
      if (!response.headersSent) {
        response.setHeader(name, value)
      }
      return response
    }
  }
}

module.exports = ResponseWithHeader
