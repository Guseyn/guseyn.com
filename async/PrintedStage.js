'use strict'

const { AsyncObject, as } = require('@cuties/cutie')
const { ReadDataByPath } = require('@cuties/fs')
const { Value } = require('@cuties/json')

class PrintedLogo extends AsyncObject {
  constructor (logo, version, step) {
    super(logo, version, step)
  }

  syncCall () {
    return (logo, version, step) => {
      console.log(`${logo}${version}\n\n${step}\n`)
      return logo
    }
  }
}

class PrintedStage {
  constructor (message) {
    return new PrintedLogo(
      new ReadDataByPath(
        new Value(as('config'), 'page.logoText')
      ),
      new Value(as('packageJSON'), 'version'),
      message
    )
  }
}

module.exports = PrintedStage
