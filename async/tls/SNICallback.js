'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { Callback } = require(`${__root}/async/async/index`)
const { SafeReadDataByPath } = require(`${__root}/async/fs/index`)
const CreatedSecureContext = require('./CreatedSecureContext')

class SNICallback extends AsyncObject {
  constructor (keyPath, certPath, caPath) {
    super(keyPath, certPath, caPath)
  }

  syncCall () {
    return (keyPath, certPath, caPath) => {
      return (domain, callback) => {
        new Callback(
          callback,
          new CreatedSecureContext(
            new SafeReadDataByPath(
              keyPath,
              { encoding: 'utf-8' }
            ),
            new SafeReadDataByPath(
              certPath,
              { encoding: 'utf-8' }
            ),
            new SafeReadDataByPath(
              caPath,
              { encoding: 'utf-8' }
            )
          )
        ).call()
      }
    }
  }
}

module.exports = SNICallback
