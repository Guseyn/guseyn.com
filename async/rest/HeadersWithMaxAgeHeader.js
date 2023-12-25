'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class HeadersWithMaxAgeHeader extends AsyncObject {
  constructor (headers, maxAge) {
    super(headers, maxAge)
  }

  syncCall () {
    return (headers, maxAge) => {
      if (maxAge) {
        headers['Access-Control-Max-Age'] = maxAge
      }
      return headers
    }
  }
}

module.exports = HeadersWithMaxAgeHeader
