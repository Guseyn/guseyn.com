'use strict'

const { as } = require('@cuties/cutie')
const {
  EndedResponse,
  WrittenResponse,
  ResponseWithWrittenHead
} = require('@cuties/http')
const {
  Endpoint,
  RequestBody
} = require('@cuties/rest')
const {
  CreatedOptions
} = require('@cuties/object')
const {
  ByteLengthOfBuffer
} = require('@cuties/buffer')

class EchoEndpoint extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    //  Use RequestBody object for fetching body from request
    return new RequestBody(request).as('BODY').after(
      new EndedResponse(
        new WrittenResponse(
          new ResponseWithWrittenHead(
            response, 200, 'ok',
            new CreatedOptions(
              'Content-Type', 'application/json',
              'Content-Length',
              new ByteLengthOfBuffer(
                as('BODY')
              )
            )
          ), as('BODY')
        )
      )
    )
  }
}

module.exports = EchoEndpoint
