'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class MessageForConnectedServer extends AsyncObject {
  constructor (protocol, host, port, pid) {
    super(protocol, host, port, pid)
  }

  syncCall () {
    return (protocol, host, port, pid) => {
      return `${protocol.toUpperCase()} Server is listening on ${host}:${port} with pid:${pid}`
    }
  }
}

module.exports = MessageForConnectedServer
