'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ArrayContainsElement extends AsyncObject {
  constructor (array, element) {
    super(array, element)
  }

  syncCall () {
    return (array, element) => {
      return array.indexOf(element) !== -1
    }
  }
}

module.exports = ArrayContainsElement
