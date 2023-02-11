'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { ClosedServer } = require(`${__root}/async/http/index`)
const { LoggedToOutput } = require(`${__root}/async/log/index`)
const { If } = require(`${__root}/async/logic/index`)

class ClearResouresOnSubprocessExitEventInProdEnv extends AsyncObject {
  constructor (server, proxyServer) {
    super(server, proxyServer)
  }

  syncCall () {
    return (server, proxyServer) => {
      return (code, signal) => {
        new If(
          server.listening,
          new ClosedServer(server).after(
            new LoggedToOutput(
              `Server on ${server._connectionKey} is closed`
            ).after(
              new If(
                proxyServer.listening,
                new ClosedServer(proxyServer).after(
                  new LoggedToOutput(
                    `Proxy server on ${proxyServer._connectionKey} is closed`
                  )
                )
              )
            )
          )
        ).call()
      }
    }
  }
}

module.exports = ClearResouresOnSubprocessExitEventInProdEnv
