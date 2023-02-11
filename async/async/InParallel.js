'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class InParallel extends AsyncObject {
  constructor (...objs) {
    super(...objs)
  }

  syncCall () {
    return (...objs) => {
      return [ ...objs ]
    }
  }
}

module.exports = InParallel
