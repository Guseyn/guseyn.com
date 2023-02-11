'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class LastElement extends AsyncObject {
  constructor (array) {
    super(array)
  }

  syncCall () {
    return (array) => {
      return array[array.length - 1]
    }
  }
}

module.exports = LastElement
