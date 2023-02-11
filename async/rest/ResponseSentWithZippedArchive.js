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

class ResponseSentWithZippedArchive extends AsyncObject {
  constructor (response, zippedArchive) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'Ok.'
          ),
          'Content-Type', 'application/zip'
        ),
        zippedArchive
      )
    )
  }
}

module.exports = ResponseSentWithZippedArchive
