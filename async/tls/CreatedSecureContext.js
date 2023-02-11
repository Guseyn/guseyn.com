'use strict'

const tls = require('tls')

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class CreatedSecureContext extends AsyncObject {
  constructor (keyData, certData, caData) {
    super(keyData, certData, caData)
  }

  syncCall () {
    return (keyData, certData, caData) => {
      return tls.createSecureContext({
        key: keyData,
        cert: certData,
        ca: caData
      })
    }
  }
}

module.exports = CreatedSecureContext
