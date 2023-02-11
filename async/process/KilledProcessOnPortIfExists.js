'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { LoggedToOutputSync } = require(`${__root}/async/log/index`)
const { promiseToCallback } = require(`${__root}/async/async/index`)
const { kill } = require('cross-port-killer')

class KilledProcessOnPortIfExists extends AsyncObject {
  constructor (port) {
    super(port)
  }

  asyncCall () {
    return (port, callback) => {
      this.port = port
      promiseToCallback(kill(port))(callback)
    }
  }

  onResult (result) {
    new LoggedToOutputSync(`process on port:${this.port} is free now`).call()
    return result
  }

  continueAfterFail () {
    return true
  }
}

module.exports = KilledProcessOnPortIfExists
