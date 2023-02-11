'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is process
class ProcessWithSignalEvent extends AsyncObject {
  constructor (process, signal, event) {
    super(process, signal, event)
  }

  // event is an Event with body()
  syncCall () {
    return (process, signal, event) => {
      process.on(signal, event)
      return process
    }
  }
}

module.exports = ProcessWithSignalEvent
