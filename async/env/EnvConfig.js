'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { ParsedJSON, Value } = require(`${__root}/async/json/index`)
const { ReadDataByPath } = require(`${__root}/async/fs/index`)

class EnvConfig {
  constructor (env) {
    return new Value(
      new ParsedJSON(
        new ReadDataByPath(
          './web-app/env-config.json'
        )
      ),
      env
    )
  }
}

module.exports = EnvConfig
