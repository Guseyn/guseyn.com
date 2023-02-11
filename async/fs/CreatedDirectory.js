'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is file (as path)
class CreatedDirectory extends AsyncObject {
  constructor (path, mode) {
    super(path, mode || 0o777)
  }

  asyncCall () {
    return (path, mode, callback) => {
      this.file = path
      fs.mkdir(path, mode, callback)
    }
  }

  onResult () {
    return this.file
  }
}

module.exports = CreatedDirectory
