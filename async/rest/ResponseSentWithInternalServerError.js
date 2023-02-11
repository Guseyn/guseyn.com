'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { CreatedMap } = require(`${__root}/async/map/index`)

const ResponseSentWithStatusCodeAndStatusMessageAndJsonBody = require('./ResponseSentWithStatusCodeAndStatusMessageAndJsonBody')

class ResponseSentWithInternalServerError extends AsyncObject {
  constructor (response, message) {
    return new ResponseSentWithStatusCodeAndStatusMessageAndJsonBody(
      response, 500, 'Internal Server Error.', new CreatedMap('message', message)
    )
  }
}

module.exports = ResponseSentWithInternalServerError
