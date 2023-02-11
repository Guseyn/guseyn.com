'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const executedLint = require('./custom-calls/executedLint')

// Represented result is process
class ExecutedLint extends AsyncObject {
  constructor (process, ...files) {
    super(process, files)
  }

  asyncCall () {
    return executedLint
  }
}

module.exports = ExecutedLint
