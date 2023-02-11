'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class Callback extends AsyncObject {
  constructor (callback, asyncObject) {
    super(callback, asyncObject)
  }

  syncCall () {
    return (callback, asyncObject) => {
      callback(null, asyncObject)
      return callback
    }
  }
}

module.exports = Callback
