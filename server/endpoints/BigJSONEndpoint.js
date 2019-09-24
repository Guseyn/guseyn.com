'use strict'

const {
  CreatedReadStream,
  StatsByPath,
  Size
} = require('@cuties/fs')
const {
  PipedReadable
} = require('@cuties/stream')
const {
  ResponseWithWrittenHead
} = require('@cuties/http')
const {
  Endpoint
} = require('@cuties/rest')
const {
  CreatedOptions
} = require('@cuties/object')

class BigJSONEndpoint extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    const FILE = './static/json/bigJSON.json'
    return new PipedReadable(
      new CreatedReadStream(FILE),
      new ResponseWithWrittenHead(
        response, 200, 'ok',
        new CreatedOptions(
          'Content-Type', 'application/json',
          'Content-Length',
          new Size(
            new StatsByPath(
              FILE
            )
          )
        )
      )
    )
  }
}

module.exports = BigJSONEndpoint
