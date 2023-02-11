'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require(`${__root}/async/http/index`)

const Endpoint = require('./Endpoint')

// Not for exports
class NotFoundEndpoint extends Endpoint {
  constructor (regexpUrl) {
    super(regexpUrl, 'GET')
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 404), 'Not found'
          ),
          'Content-Type', 'text/plain'
        ),
        '404: Not found'
      )
    )
  }
}

module.exports = NotFoundEndpoint
