'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`

const {
  ResponseWithHeaders,
  ResponseWithStatusCode,
  EndedResponse
} = require(`${__root}/async/http/index`)

const {
  CreatedMap
} = require(`${__root}/async/map/index`)

const Endpoint = require('./Endpoint')

const AllowedOrigin = require('./../AllowedOrigin')
const HeadersWithAllowCredentialsHeader = require('./../HeadersWithAllowCredentialsHeader')
const HeadersWithMaxAgeHeader = require('./../HeadersWithMaxAgeHeader')

class CORSEndpoint extends Endpoint {
  constructor (
    regexpUrl,
    {
      allowedOrigins,
      allowedMethods,
      allowedHeaders,
      allowedCredentials,
      maxAge
    } = {}
  ) {
    super(regexpUrl, 'OPTIONS')
    this.allowedOrigins = allowedOrigins
    this.allowedMethods = allowedMethods
    this.allowedHeaders = allowedHeaders
    this.allowedCredentials = allowedCredentials
    this.maxAge = maxAge
  }

  body (request, response) {
    return new EndedResponse(
      new ResponseWithStatusCode(
        new ResponseWithHeaders(
          response,
          new HeadersWithMaxAgeHeader(
            new HeadersWithAllowCredentialsHeader(
              new CreatedMap(
                'Access-Control-Allow-Origin',
                new AllowedOrigin(
                  this.allowedOrigins, request
                ),
                'Access-Control-Allow-Methods',
                this.allowedMethods ? this.allowedMethods.join(', ') : 'GET, OPTIONS',
                'Access-Control-Allow-Headers',
                this.allowedHeaders ? this.allowedHeaders.join(', ') : Object.keys(request.headers).join(', ')
              ), this.allowedCredentials
            ), this.maxAge
          )
        ), 200
      )
    )
  }
}

module.exports = CORSEndpoint
