'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is server
class ListeningServer extends AsyncObject {
  constructor (server, options) {
    super(server, options)
  }

  syncCall () {
    return (server, options) => {
      return server.listen(options)
    }
  }
}

module.exports = ListeningServer
