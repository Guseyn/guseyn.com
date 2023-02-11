'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is process
class ExitedProcess extends AsyncObject {
  constructor (process, code) {
    super(process, code)
  }

  syncCall () {
    return (process, code) => {
      process.exit(code)
    }
  }
}

module.exports = ExitedProcess
