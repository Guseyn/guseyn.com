'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ServerErrorEvent extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      return (error, request, response) => {
        response.statusCode = 500
        response.setHeader('content-type', 'text/plain')
        response.end(`Internal Server Error (500):\n ${error.stack}`)
      }
    }
  }
}

module.exports = ServerErrorEvent
