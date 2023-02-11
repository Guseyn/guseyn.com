'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class JWTPayloadValue extends AsyncObject {
  constructor (token, key) {
    super(token, key)
  }

  syncCall () {
    return (token, key) => {
      const parts = token.split('.')
      const payload = this.base64UrlDecodeToJSON(parts[1])
      return payload[key]
    }
  }

  base64UrlDecodeToJSON (str) {
    return JSON.parse(
      Buffer.from(
        str.replace(/-/g, '+').replace(/_/g, '/'), 'base64'
      ).toString('utf8')
    )
  }
}

module.exports = JWTPayloadValue
