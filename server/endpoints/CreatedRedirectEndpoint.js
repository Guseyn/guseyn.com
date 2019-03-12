'use strict'

const { AsyncObject } = require('@cuties/cutie')
const RedirectEndpoint = require('./RedirectEndpoint')

class CreatedRedirectEndpoint extends AsyncObject {
  constructor (httpPort, httpsPort) {
    super(httpPort, httpsPort)
  }

  syncCall () {
    return (httpPort, httpsPort) => {
      return new RedirectEndpoint(httpPort, httpsPort)
    }
  }
}

module.exports = CreatedRedirectEndpoint
