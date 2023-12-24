'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('unison'))}unison`
const { AsyncObject } = require(`${__root}/async/core/index`)

class HeadersWithAllowCredentialsHeader extends AsyncObject {
  constructor (headers, allowedCredentials) {
    super(headers, allowedCredentials)
  }

  syncCall () {
    return (headers, allowedCredentials) => {
      if (allowedCredentials) {
        headers['Access-Control-Allow-Credentials'] = true
      }
      return headers
    }
  }
}

module.exports = HeadersWithAllowCredentialsHeader
