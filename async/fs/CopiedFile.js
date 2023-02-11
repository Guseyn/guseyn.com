'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is a file (represented result of dest)
class CopiedFile extends AsyncObject {
  constructor (src, dest, flags) {
    super(src, dest, flags || 0)
  }

  asyncCall () {
    return (src, dest, flags, callback) => {
      this.file = dest
      fs.copyFile(src, dest, flags, callback)
    }
  }

  onResult () {
    return this.file
  }
}

module.exports = CopiedFile
