'use strict'

const { as } = require('@cuties/cutie')
const { ReadDataByPath } = require('@cuties/fs')
const { Value } = require('@cuties/json')
const PrintedToConsolePageLogo = require('./PrintedToConsolePageLogo')

class PrintedLogoToConsole {
  constructor (message) {
    return new PrintedToConsolePageLogo(
      new ReadDataByPath(
        new Value(as('config'), 'page.logoText')
      ),
      new Value(as('packageJSON'), 'version'),
      message
    )
  }
}

module.exports = PrintedLogoToConsole
