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

class InternalServerErrorEndpoint extends Endpoint {
  constructor (regexpUrl) {
    super(regexpUrl || new RegExp(/^\/internal-server-error/))
  }

  body (request, response, error) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 500), 'Internal Server Error'
          ),
          'Content-Type', 'text/plain'
        ),
        `500: Internal Server Error, \n${error}`
      )
    )
  }
}

module.exports = InternalServerErrorEndpoint
