'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { ClosedServer } = require(`${__root}/async/http/index`)
const { LoggedToOutput } = require(`${__root}/async/log/index`)
const { If } = require(`${__root}/async/logic/index`)

class ClearResouresOnSubprocessExitEventInLocalEnv extends AsyncObject {
  constructor (server) {
    super(server)
  }

  syncCall () {
    return (server) => {
      return (code, signal) => {
        new If(
          server.listening,
          new ClosedServer(server).after(
            new LoggedToOutput(
              `Server on ${server._connectionKey} is closed`
            )
          )
        ).call()
      }
    }
  }
}

module.exports = ClearResouresOnSubprocessExitEventInLocalEnv
