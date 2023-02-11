'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is file[]
class ReadFilesOfDirectory extends AsyncObject {
  constructor (path, options) {
    super(path, options || 'utf8')
  }

  asyncCall () {
    return fs.readdir
  }
}

module.exports = ReadFilesOfDirectory
