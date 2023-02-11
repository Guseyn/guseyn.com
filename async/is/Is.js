'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Is extends AsyncObject {
  constructor (value, clazz) {
    super(value, clazz)
  }

  syncCall () {
    return (value, clazz) => {
      return value instanceof clazz
    }
  }
}

module.exports = Is
