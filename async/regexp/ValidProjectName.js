'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidProjectName extends AsyncObject {
  constructor (name) {
    super(name)
  }

  syncCall () {
    return (name) => {
      return name.trim().length > 0
    }
  }
}

module.exports = ValidProjectName
