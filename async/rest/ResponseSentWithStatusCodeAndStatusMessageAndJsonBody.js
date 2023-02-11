'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require(`${__root}/async/http/index`)
const { StringifiedJSON } = require(`${__root}/async/json/index`)

class ResponseSentWithStatusCodeAndStatusMessageAndJsonBody extends AsyncObject {
  constructor (response, statusCode, statusMessage, jsonBody) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, statusCode), statusMessage
          ),
          'Content-Type', 'application/json'
        ),
        new StringifiedJSON(jsonBody)
      )
    )
  }
}

module.exports = ResponseSentWithStatusCodeAndStatusMessageAndJsonBody
