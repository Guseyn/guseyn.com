'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ConcatenatedStrings extends AsyncObject {
  constructor (...strings) {
    super(...strings)
  }

  syncCall () {
    return (...strings) => {
      return ''.concat(...strings)
    }
  }
}

module.exports = ConcatenatedStrings
