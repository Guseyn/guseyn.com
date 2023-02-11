'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const crypto = require('crypto')

class GeneratedHS256JWT extends AsyncObject {
  constructor (payload, secret, minutesFromNow) {
    super(payload, secret, minutesFromNow)
  }

  syncCall () {
    return (payload, secret, minutesFromNow) => {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      }
      const encodedHeaderInBase64 = this.base64UrlEncodeJSON(header)
      const encodedPayloadInBase64 = this.base64UrlEncodeJSON(
        minutesFromNow ? this.payloadWithExpiration(payload, minutesFromNow) : payload
      )
      const encodedSignatureInBase64 = this.generateSignature(
        `${encodedHeaderInBase64}.${encodedPayloadInBase64}`, secret
      )
      return `${encodedHeaderInBase64}.${encodedPayloadInBase64}.${encodedSignatureInBase64}`
    }
  }

  payloadWithExpiration (payload, minutesFromNow) {
    const payloadWithExpiration = Object.assign({}, payload)
    let date = new Date()
    date.setMinutes(date.getMinutes() + minutesFromNow)
    payloadWithExpiration.exp = date.getTime()
    return payloadWithExpiration
  }

  base64UrlEncodeJSON (json) {
    return Buffer.from(
      JSON.stringify(json)
    ).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  generateSignature (str, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(str)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }
}

module.exports = GeneratedHS256JWT
