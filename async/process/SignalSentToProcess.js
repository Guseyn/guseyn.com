'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is signal
class SignalSentToProcess extends AsyncObject {
  constructor (pid, signal) {
    super(pid, signal)
  }

  syncCall () {
    return (pid, signal) => {
      if (pid) {
        process.kill(pid, signal)
      }
      return signal
    }
  }
}

module.exports = SignalSentToProcess
