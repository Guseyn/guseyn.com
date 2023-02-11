'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { CreatedReadStream } = require(`${__root}/async/fs/index`)
const { ResponseWithStatusCode, ResponseWithHeaders } = require(`${__root}/async/http/index`)
const { PipedReadable, ReadableWithErrorEvent } = require(`${__root}/async/stream/index`)
const { IndexEndpoint, NotFoundErrorEvent } = require(`${__root}/async/rest/index`)

class CustomIndexEndpoint extends IndexEndpoint {
  constructor (page, notFoundEndpoint) {
    super()
    this.page = page
    this.notFoundEndpoint = notFoundEndpoint
  }

  body (request, response) {
    return new PipedReadable(
      new ReadableWithErrorEvent(
        new CreatedReadStream(
          this.page
        ),
        new NotFoundErrorEvent(
          this.notFoundEndpoint, request, response
        )
      ),
      new ResponseWithStatusCode(
        new ResponseWithHeaders(
          response, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html'
          }
        ), 200
      )
    )
  }
}

module.exports = CustomIndexEndpoint
