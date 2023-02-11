'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const spawnCommand = require('./custom-calls/spawnCommand')

// Represented result is process
class SpawnedCommand extends AsyncObject {
  constructor (command, args, options) {
    super(command, args || [], options || {
      stdio: [process.stdin, process.stdout, process.stderr]
    })
  }

  asyncCall () {
    return spawnCommand
  }
}

module.exports = SpawnedCommand
