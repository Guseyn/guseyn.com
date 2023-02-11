'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidScreenDate extends AsyncObject {
  constructor (date) {
    super(date)
  }

  syncCall () {
    return (date) => {
      return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date)
    }
  }
}

module.exports = ValidScreenDate
