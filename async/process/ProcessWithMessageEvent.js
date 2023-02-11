'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is process
class ProcessWithMessageEvent extends AsyncObject {
  constructor (process, event) {
    super(process, event)
  }

  // event is an Event with body(msg)
  syncCall () {
    return (process, event) => {
      process.on('message', event)
      return process
    }
  }
}

module.exports = ProcessWithMessageEvent
