'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class InvokedEndpoint extends AsyncObject {
  constructor (endpoint, request, response, ...args) {
    super(endpoint, request, response, ...args)
  }

  syncCall () {
    return (endpoint, request, response, ...args) => {
      endpoint.body(request, response, ...args).call()
      return endpoint
    }
  }
}

module.exports = InvokedEndpoint
