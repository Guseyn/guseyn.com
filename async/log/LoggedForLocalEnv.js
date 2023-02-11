'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class LoggedForLocalEnv extends AsyncObject {
  constructor (...objs) {
    super(...objs)
  }

  syncCall () {
    return (...objs) => {
      const ENV = process.env.NODE_ENV || 'local'
      if (ENV === 'local') {
        console.log(...objs)
      }
    }
  }
}

module.exports = LoggedForLocalEnv
