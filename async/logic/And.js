'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class And extends AsyncObject {
  constructor (...statements) {
    super(...statements)
  }

  syncCall () {
    return (...statements) => {
      return statements.every(s => s)
    }
  }
}

module.exports = And
