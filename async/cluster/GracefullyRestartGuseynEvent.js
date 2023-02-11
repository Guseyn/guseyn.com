'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { LoggedToOutputSync } = require(`${__root}/async/log/index`)

const TIME_TO_EXIT_PROCESS = 10000
const TIME_TO_WAIT_BEFORE_LOG_MESSAGE_ABOUT_RESTARTED_SUBPROCESSES = 6500

const disconnectAndExitAllWorkersWithTimeoutRecursively = (allWorkers, currentWorkerIndex, callback) => {
  if (currentWorkerIndex < allWorkers.length) {
    const currentWoker = allWorkers[currentWorkerIndex]
    if (currentWoker.process.connected) {
      try {
        currentWoker.send('Message from Primary Process: Exit your process with code 0 to restart it again.')
        currentWoker.disconnect()
        setTimeout(() => {
          try {
            disconnectAndExitAllWorkersWithTimeoutRecursively(
              allWorkers,
              currentWorkerIndex + 1,
              callback
            )
          } catch (error) {
            callback(error, null)
          }
        }, TIME_TO_EXIT_PROCESS)
      } catch (error) {
        callback(error, null)
      }
    }
  } else {
    callback(null, allWorkers)
  }
}

class WorkersRestartedOneByOne extends AsyncObject {
  constructor (cluster) {
    super(cluster)
  }

  asyncCall () {
    return (cluster, callback) => {
      const allWorkers = Object.values(cluster.workers)
      disconnectAndExitAllWorkersWithTimeoutRecursively(
        allWorkers,
        0,
        callback
      )
    }
  }

  onResult (result) {
    setTimeout(() => {
      // To be sure message will be dispalyed after all workers are restarted.
      new LoggedToOutputSync('All workers are restarted successfully (gracefully and recursively with timeout).').call()
    }, TIME_TO_WAIT_BEFORE_LOG_MESSAGE_ABOUT_RESTARTED_SUBPROCESSES)
    return result
  }
}

class GracefullyRestartGuseynEvent extends AsyncObject {
  constructor (cluster) {
    super(cluster)
  }

  syncCall () {
    return (cluster) => {
      return (code, signal) => {
        new WorkersRestartedOneByOne(
          cluster
        ).call()
      }
    }
  }
}

module.exports = GracefullyRestartGuseynEvent
