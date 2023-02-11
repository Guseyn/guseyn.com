'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const find = require('find-process')
const { promiseToCallback } = require(`${__root}/async/async/index`)

const notDefinedProcess = {}

// Represented result is process
class FoundProcessOnPort extends AsyncObject {
  constructor (port) {
    super(port)
  }

  asyncCall () {
    return (port, callback) => {
      promiseToCallback(find('port', port))(callback)
    }
  }

  onResult (processes) {
    return (processes == null || processes.length === 0) ? notDefinedProcess : processes[0]
  }
}

module.exports = FoundProcessOnPort
