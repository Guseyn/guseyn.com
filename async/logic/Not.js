'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Not extends AsyncObject {
  constructor (statement) {
    super(statement)
  }

  syncCall () {
    return (statement) => {
      return !statement
    }
  }
}

module.exports = Not
