'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is number
class ByteLength extends AsyncObject {
  constructor (data, encoding) {
    super(data, encoding)
  }

  syncCall () {
    return (data, encoding) => {
      return Buffer.byteLength(data, encoding)
    }
  }
}

module.exports = ByteLength
