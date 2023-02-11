'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ForEach extends AsyncObject {
  constructor (array, func) {
    super(array, func)
  }

  asyncCall () {
    return (array, func, callback) => {
      array.forEach(func)
    }
  }
}

module.exports = ForEach
