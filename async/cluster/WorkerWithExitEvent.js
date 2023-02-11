'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is worker
class WorkerWithExitEvent extends AsyncObject {
  constructor (worker, event) {
    super(worker, event)
  }

  // event is an Event with body(code, signal)
  syncCall () {
    return (worker, event) => {
      worker.on('exit', event)
      return worker
    }
  }
}

module.exports = WorkerWithExitEvent
