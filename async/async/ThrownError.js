'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ThrownError extends AsyncObject {
  constructor (error) {
    super(error)
  }

  syncCall () {
    return (error) => {
      throw error
    }
  }
}

module.exports = ThrownError
