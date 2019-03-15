'use strict'

const { Endpoint } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')

class RedirectEndpoint extends Endpoint {
  constructor (httpPort, httpsPort) {
    super(new RegExp(/.*/))
    this.httpPort = httpPort
    this.httpsPort = httpsPort
  }

  body (request, response) {
    request.headers.host = request.headers.host || ''
    return new EndedResponse(
      new ResponseWithWrittenHead(response, 301, {
        'Location': `https://${request.headers.host.replace(`:${this.httpPort}`, `${this.httpsPort === 433 ? '' : `:${this.httpsPort}`}`)}${request.url}`
      })
    )
  }
}

module.exports = RedirectEndpoint
