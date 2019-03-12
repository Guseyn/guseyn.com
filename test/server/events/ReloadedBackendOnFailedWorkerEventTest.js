'use strict'

const ReloadedBackendOnFailedWorkerEvent = require('./../../../server/events/ReloadedBackendOnFailedWorkerEvent')
const { AsyncObject } = require('@cuties/cutie')
const { Assertion } = require('@cuties/assert')
const { Is } = require('@cuties/is')

class InvokedReloadedBackendOnFailedWorkerEvent extends AsyncObject {
  constructor (event, worker, code, signal) {
    super(event, worker, code, signal)
  }

  syncCall () {
    return (event, worker, code, signal) => {
      event(worker, code, signal)
      return event
    }
  }
}

new Assertion(
  new Is(
    new InvokedReloadedBackendOnFailedWorkerEvent(
      new ReloadedBackendOnFailedWorkerEvent({ fork: () => {} }),
      { process: { pid: 1 } }, 1
    ),
    Function
  )
).call()
