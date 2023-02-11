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

class IndexEndpoint extends Endpoint {
  constructor () {
    super(new RegExp(/^(\/|)$/), 'GET')
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'Ok'
          ),
          'Content-Type', 'text/plain'
        ),
        'Index.'
      )
    )
  }
}

module.exports = IndexEndpoint
