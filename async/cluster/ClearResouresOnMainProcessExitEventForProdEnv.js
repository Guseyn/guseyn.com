'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { InParallel } = require(`${__root}/async/async/index`)
const { SafeUnlinkedFile } = require(`${__root}/async/fs/index`)
const { LoggedErrorToFileInLogsDir } = require(`${__root}/async/log/index`)
const { ExitedProcess } = require(`${__root}/async/process/index`)

class ClearResouresOnMainProcessExitEventForProdEnv extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return (primaryProcessPidFilePath) => {
      return (code, signal) => {
        new InParallel(
          new SafeUnlinkedFile(primaryProcessPidFilePath)
        ).after(
          new LoggedErrorToFileInLogsDir(`code: ${code}, signal: ${signal}`).after(
            new ExitedProcess(process, code)
          )
        ).call()
      }
    }
  }
}

module.exports = ClearResouresOnMainProcessExitEventForProdEnv
