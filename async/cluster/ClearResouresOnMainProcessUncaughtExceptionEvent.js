'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { InParallel } = require(`${__root}/async/async/index`)
const { LoggedErrorToFileInLogsDir } = require(`${__root}/async/log/index`)
const { ExitedProcess } = require(`${__root}/async/process/index`)

class ClearResouresOnMainProcessUncaughtExceptionEvent extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      return (error, origin) => {
        new InParallel(
          new LoggedErrorToFileInLogsDir(`error: ${error}, origin: ${origin}`).after(
            new ExitedProcess(process, 1)
          )
        ).call()
      }
    }
  }
}

module.exports = ClearResouresOnMainProcessUncaughtExceptionEvent
