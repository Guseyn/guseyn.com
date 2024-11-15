const TIME_TO_EXIT_PROCESS = 10

function disconnectAndExitAllWorkersWithTimeoutRecursively(
  allWorkers,
  currentWorkerIndex,
  restartTime,
  callback
) {
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
              restartTime,
              callback
            )
          } catch (error) {
            callback(error, null)
          }
        }, (restartTime || TIME_TO_EXIT_PROCESS) * 1000)
      } catch (error) {
        callback(error, null)
      }
    }
  } else {
    callback(null, allWorkers)
  }
}

module.exports = disconnectAndExitAllWorkersWithTimeoutRecursively
