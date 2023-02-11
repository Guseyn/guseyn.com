'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { Endpoint } = require(`${__root}/async/rest/index`)
const { EndedResponse, ResponseWithWrittenHead } = require(`${__root}/async/http/index`)

class ProxyEndpoint extends Endpoint {
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

module.exports = ProxyEndpoint
