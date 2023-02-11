'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { ReadableWithErrorEvent } = require(`${__root}/async/stream/index`)
const { MethodOfIncomingMessage, UrlOfIncomingMessage } = require(`${__root}/async/http/index`)

const MatchedEndpoint = require('./endpoint/MatchedEndpoint')
const InvokedEndpoint = require('./endpoint/InvokedEndpoint')
const ErrorEvent = require('./event/ErrorEvent')

// Represents request-response listener
class RestApi extends AsyncObject {
  constructor (...endpoints) {
    super(...endpoints)
  }

  syncCall () {
    return (...endpoints) => {
      return (request, response) => {
        new InvokedEndpoint(
          new MatchedEndpoint(
            endpoints,
            new UrlOfIncomingMessage(request),
            new MethodOfIncomingMessage(request)
          ),
          new ReadableWithErrorEvent(
            request, new ErrorEvent(endpoints, request, response)
          ),
          response
        ).call()
      }
    }
  }
}

module.exports = RestApi
