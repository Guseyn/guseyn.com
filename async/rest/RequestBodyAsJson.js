'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { StringFromBuffer } = require(`${__root}/async/buffer/index`)
const { SafeParsedJSON } = require(`${__root}/async/json/index`)

const RequestBody = require('./RequestBody')

class RequestBodyAsJson extends AsyncObject {
  constructor (request) {
    return new SafeParsedJSON(
      new StringFromBuffer(
        new RequestBody(
          request
        )
      )
    )
  }
}

module.exports = RequestBodyAsJson
