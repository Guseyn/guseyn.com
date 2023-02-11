'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is process
class ProcessWithUncaughtException extends AsyncObject {
  constructor (process, event) {
    super(process, event)
  }

  // event is an Event with body()
  syncCall () {
    return (process, event) => {
      process.on('uncaughtException', event)
      return process
    }
  }
}

module.exports = ProcessWithUncaughtException
