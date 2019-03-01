'use strict'

const { NotFoundEndpoint } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')

class CustomNotFoundEndpoint extends NotFoundEndpoint {
  constructor (regexpUrl) {
    super(regexpUrl)
  }

  body (request, response) {
    return new EndedResponse(
      new ResponseWithWrittenHead(response, 301, {
        'Location': `/../html/404.html`
      })
    )
  }
}

module.exports = CustomNotFoundEndpoint
