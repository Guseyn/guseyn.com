'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ExitSubprocessOnMessageFromPrimaryProcessEvent extends AsyncObject {
  constructor (process) {
    super(process)
  }

  syncCall () {
    return (process) => {
      return (message) => {
        if (message === 'Message from Primary Process: Exit your process with code 0 to restart it again.') {
          process.exit(0)
        }
      }
    }
  }
}

module.exports = ExitSubprocessOnMessageFromPrimaryProcessEvent
