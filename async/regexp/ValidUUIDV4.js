'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidUUIDV4 extends AsyncObject {
  constructor (token) {
    super(token)
  }

  syncCall () {
    return (token) => {
      return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(token)
    }
  }
}

module.exports = ValidUUIDV4
