'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Sleep extends AsyncObject {
  constructor (ms) {
    super(ms)
  }

  asyncCall () {
    return (ms, callback) => {
      setTimeout(callback, ms)
    }
  }

  onResult () {
    return 0
  }
}

module.exports = Sleep
