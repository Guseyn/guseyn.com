'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const zlib = require('zlib')

class Deflated extends AsyncObject {
  constructor (data, options) {
    super(data, options || {})
  }

  asyncCall () {
    return zlib.deflate
  }
}

module.exports = Deflated
