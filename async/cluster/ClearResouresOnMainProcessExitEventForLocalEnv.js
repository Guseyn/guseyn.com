'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { InParallel } = require(`${__root}/async/async/index`)
const { ExitedProcess } = require(`${__root}/async/process/index`)
const { SafeUnlinkedFile } = require(`${__root}/async/fs/index`)

class ClearResouresOnMainProcessExitEventForLocalEnv extends AsyncObject {
  constructor (primaryProcessPidFilePath) {
    super(primaryProcessPidFilePath)
  }

  syncCall () {
    return (primaryProcessPidFilePath) => {
      return (code, signal) => {
        new InParallel(
          new SafeUnlinkedFile(primaryProcessPidFilePath)
        ).after(
          new ExitedProcess(process)
        ).call()
      }
    }
  }
}

module.exports = ClearResouresOnMainProcessExitEventForLocalEnv
