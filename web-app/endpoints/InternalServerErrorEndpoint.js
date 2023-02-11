
'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { Endpoint } = require(`${__root}/async/rest/index`)

class InternalServerErrorEndpoint extends Endpoint {
  constructor (regexpUrl) {
    super(regexpUrl, 'GET')
  }

  body (request, response) {
    throw new Error('internal server error')
  }
}

module.exports = InternalServerErrorEndpoint
