'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidPositiveInteger extends AsyncObject {
  constructor (str) {
    super(str)
  }

  syncCall () {
    return (str) => {
      if (typeof str !== 'string') {
        return false
      }
      const num = Number(str)
      if (Number.isInteger(num) && num > 0) {
        return true
      }
      return false
    }
  }
}

module.exports = ValidPositiveInteger
