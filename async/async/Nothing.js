'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Nothing extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      return null
    }
  }
}

module.exports = Nothing
