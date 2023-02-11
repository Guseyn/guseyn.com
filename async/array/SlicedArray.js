'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class SlicedArray extends AsyncObject {
  constructor (array, start, end) {
    super(array, start, end)
  }

  syncCall () {
    return (array, start, end) => {
      return array.slice(start, end)
    }
  }
}

module.exports = SlicedArray
