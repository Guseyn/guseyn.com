'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const readFilesOfDirectoryRecursively = require('./custom-calls/readFilesOfDirectoryRecursively')

// Represented result is file[]
class ReadFilesOfDirectoryRecursively extends AsyncObject {
  constructor (dir, options) {
    super(dir, options || 'utf8')
  }

  asyncCall () {
    return readFilesOfDirectoryRecursively
  }
}

module.exports = ReadFilesOfDirectoryRecursively
