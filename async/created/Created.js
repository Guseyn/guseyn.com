'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Created extends AsyncObject {
  constructor (Obj, ...args) {
    super(Obj, ...args)
  }

  syncCall () {
    return (Obj, ...args) => {
      return new Obj(...args)
    }
  }
}

module.exports = Created
