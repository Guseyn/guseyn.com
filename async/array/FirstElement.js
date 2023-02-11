'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class FirstElement extends AsyncObject {
  constructor (array) {
    super(array)
  }

  syncCall () {
    return (array) => {
      return array[0]
    }
  }
}

module.exports = FirstElement
