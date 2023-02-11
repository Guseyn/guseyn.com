'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class IsAsyncObject extends AsyncObject {
  constructor (value) {
    super(() => {
      return value
    })
  }

  syncCall () {
    return (value) => {
      return value() instanceof AsyncObject
    }
  }
}

module.exports = IsAsyncObject
