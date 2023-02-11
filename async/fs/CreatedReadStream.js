'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is ReadStream
class CreatedReadStream extends AsyncObject {
  constructor (path, options) {
    super(path, options || {
      flags: 'r',
      encoding: null,
      fd: null,
      mode: 0o666,
      autoClose: true,
      highWaterMark: 64 * 1024
    })
  }

  syncCall () {
    return (path, options) => {
      return fs.createReadStream(path, options)
    }
  }
}

module.exports = CreatedReadStream
