'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

const ResponseSentWithStatusCodeAndStatusMessageAndJsonBody = require('./ResponseSentWithStatusCodeAndStatusMessageAndJsonBody')

class ResponseSentWithOkResult extends AsyncObject {
  constructor (response, result = {}) {
    return new ResponseSentWithStatusCodeAndStatusMessageAndJsonBody(
      response, 200, 'Ok.', result
    )
  }
}

module.exports = ResponseSentWithOkResult
