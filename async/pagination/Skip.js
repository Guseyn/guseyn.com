'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Skip extends AsyncObject {
  constructor (page, perPage) {
    super(page, perPage)
  }

  syncCall () {
    return (page, perPage) => {
      return (page * 1 - 1) * perPage * 1
    }
  }
}

module.exports = Skip
