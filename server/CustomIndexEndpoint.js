'use strict'

const { IndexEndpoint } = require('@cuties/rest')
const { ResponseWithWrittenHead, CreatedOptions, EndedResponse } = require('@cuties/http')
const UrlWithVersion = require('./UrlWithVersion')

class CustomIndexEndpoint extends IndexEndpoint {
  constructor (indexUrl, version) {
    super()
    this.indexUrl = indexUrl
    this.version = version
  }

  body (request, response) {
    return new EndedResponse(
      new ResponseWithWrittenHead(
        response,
        301,
        new CreatedOptions(
          'Location',
          new UrlWithVersion(
            this.indexUrl,
            this.version
          )
        )
      )
    )
  }
}

module.exports = CustomIndexEndpoint
