'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { CreatedReadStream } = require(`${__root}/async/fs/index`)
const { ResponseWithStatusCode, ResponseWithHeader } = require(`${__root}/async/http/index`)
const { PipedReadable } = require(`${__root}/async/stream/index`)
const { NotFoundEndpoint } = require(`${__root}/async/rest/index`)

class CustomNotFoundEndpoint extends NotFoundEndpoint {
  constructor (regexpUrl, page) {
    super(regexpUrl)
    this.page = page
  }

  body (request, response) {
    return new PipedReadable(
      new CreatedReadStream(
        this.page
      ),
      new ResponseWithStatusCode(
        new ResponseWithHeader(
          response, 'Content-Type',
          'text/html'
        ), 404
      )
    )
  }
}

module.exports = CustomNotFoundEndpoint
