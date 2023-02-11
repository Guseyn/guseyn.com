'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidPassword extends AsyncObject {
  constructor (password) {
    super(password)
  }

  syncCall () {
    return (password) => {
      return /^.{8,}$/.test(password)
    }
  }
}

module.exports = ValidPassword
