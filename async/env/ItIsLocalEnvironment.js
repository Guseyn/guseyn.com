'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ItIsLocalEnvironment extends AsyncObject {
  constructor (env) {
    super(env)
  }

  syncCall () {
    return (env) => {
      return env === 'local'
    }
  }
}

module.exports = ItIsLocalEnvironment
