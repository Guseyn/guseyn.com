'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class JWTFromRequest extends AsyncObject {
  constructor (request, tokenName) {
    super(request, tokenName || 'Bearer')
  }

  syncCall () {
    return (request, tokenName) => {
      if (!request.headers['authorization']) {
        return ''
      }
      return request.headers['authorization'].split(`${tokenName} `)[1]
    }
  }
}

module.exports = JWTFromRequest
