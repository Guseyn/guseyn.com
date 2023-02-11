const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class MessageForConnectedProxyServer extends AsyncObject {
  constructor (options, pid) {
    super(options, pid)
  }

  syncCall () {
    return (options, pid) => {
      if (options.proxy) {
        return `${options.proxy.protocol.toUpperCase()} Proxy Server is listening on ${options.proxy.host}:${options.proxy.port} with pid:${pid}`
      }
      return `No Proxy Server is running on pid:${pid}`
    }
  }
}

module.exports = MessageForConnectedProxyServer
