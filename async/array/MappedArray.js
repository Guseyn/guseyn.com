'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class MappedArray extends AsyncObject {
  constructor (array, func) {
    super(array, func)
  }

  syncCall () {
    return (array, func) => {
      return array.map(func)
    }
  }
}

module.exports = MappedArray
