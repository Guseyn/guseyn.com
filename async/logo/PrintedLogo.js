'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { ReadDataByPath } = require(`${__root}/async/fs/index`)
const { ParsedJSON, Value } = require(`${__root}/async/json/index`)
const { LoggedToOutputSync } = require(`${__root}/async/log/index`)

class PrintedLogo extends AsyncObject {
  constructor (logo, version) {
    super(logo, version)
  }

  syncCall () {
    return (logo, version) => {
      new LoggedToOutputSync(`${logo}\nv${version}\n`).call()
      return logo
    }
  }
}

module.exports = class {
  constructor () {
    return new PrintedLogo(
      new ReadDataByPath(
        'web-app/logo.txt'
      ),
      new Value(
        new ParsedJSON(
          new ReadDataByPath(
            'package.json'
          )
        ),
        'version'
      )
    )
  }
}
