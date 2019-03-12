'use strict'

const { Endpoint } = require('@cuties/rest')
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require('@cuties/http')
const { ReadFilesOfDirectory } = require('@cuties/fs')
const CreatedLogsPage = require('./../async/CreatedLogsPage')

class LogsEndpoint extends Endpoint {
  constructor (regexpUrl, logsDir) {
    super(regexpUrl, 'GET')
    this.logsDir = logsDir
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'all logs'
          ),
          'Content-Type', 'text/html'
        ),
        new CreatedLogsPage(
          new ReadFilesOfDirectory(
            this.logsDir
          )
        )
      )
    )
  }
}

module.exports = LogsEndpoint
