'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class FirstNumberIsGreaterThanOrEqualToSecondOne extends AsyncObject {
  constructor (fistNumber, secondNumber) {
    super(fistNumber, secondNumber)
  }

  syncCall () {
    return (fistNumber, secondNumber) => {
      return fistNumber >= secondNumber
    }
  }
}

module.exports = FirstNumberIsGreaterThanOrEqualToSecondOne
