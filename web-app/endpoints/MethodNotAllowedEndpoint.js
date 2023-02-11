
'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { NotFoundEndpoint } = require(`${__root}/async/rest/index`)

const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require(`${__root}/async/http/index`)

class MethodNotAllowedEndpoint extends NotFoundEndpoint {
  constructor (regexpUrl) {
    super(regexpUrl)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 405), 'Method not allowed.'
          ),
          'Content-Type', 'text/plain'
        ),
        'Method not allowed.'
      )
    )
  }
}

module.exports = MethodNotAllowedEndpoint
