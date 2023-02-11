'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { exec } = require('child_process')

// Represented result is process
class ExecutedCommand extends AsyncObject {
  constructor (command) {
    super(command)
  }

  asyncCall () {
    return exec
  }
}

module.exports = ExecutedCommand
