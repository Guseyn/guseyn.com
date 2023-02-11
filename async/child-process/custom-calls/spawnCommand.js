'use strict'

const spawn = require('child_process').spawn

module.exports = (command, args, options, callback) => {
  const spawnedCommand = spawn(command, args, options)
  let callbackInvoked = false
  spawnedCommand.on('error', (error) => {
    callbackInvoked = true
    spawnedCommand.emit('exit')
    callback(error)
  })
  spawnedCommand.on('exit', (code) => {
    if (!callbackInvoked) {
      if (code === 0) {
        callback(null, command)
      } else {
        callback(new Error(`command failed with code ${code}`))
      }
    }
  })
}
