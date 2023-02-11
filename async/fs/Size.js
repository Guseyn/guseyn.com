'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is number
class Size extends AsyncObject {
  constructor (stats) {
    super(stats)
  }

  syncCall () {
    return (stats) => {
      return stats.size
    }
  }
}

module.exports = Size
