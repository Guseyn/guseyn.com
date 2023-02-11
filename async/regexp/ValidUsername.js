'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidUsername extends AsyncObject {
  constructor (username) {
    super(username)
  }

  syncCall () {
    return (username) => {
      return /^([a-zA-Z0-9-_.]{4,})$/.test(username)
    }
  }
}

module.exports = ValidUsername
