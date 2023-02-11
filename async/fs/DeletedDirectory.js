'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is file (as path)
class DeletedDirectory extends AsyncObject {
  constructor (path) {
    super(path)
  }

  asyncCall () {
    return (path, callback) => {
      this.file = path
      fs.rmdir(path, callback)
    }
  }

  onResult () {
    return this.file
  }
}

module.exports = DeletedDirectory
