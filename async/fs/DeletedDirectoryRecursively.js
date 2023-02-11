'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const deletedDirectoryRecursively = require('./custom-calls/deletedDirectoryRecursively')

// Represented result is dir
class DeletedDirectoryRecursively extends AsyncObject {
  constructor (dir, options) {
    super(dir, options || 'utf8')
  }

  asyncCall () {
    return deletedDirectoryRecursively
  }
}

module.exports = DeletedDirectoryRecursively
