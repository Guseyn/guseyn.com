'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { InternalServerErrorEndpoint } = require(`${__root}/async/rest/index`)

class CustomInternalServerErrorEndpoint extends InternalServerErrorEndpoint {
  constructor () {
    super()
  }

  body (request, response, error) {
    return super.body(request, response, error)
  }
}

module.exports = CustomInternalServerErrorEndpoint
