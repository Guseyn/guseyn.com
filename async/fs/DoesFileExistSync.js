'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is boolean
// async variation of this object is not supported
//  due to https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
class DoesFileExistSync extends AsyncObject {
  constructor (path) {
    super(path)
  }

  syncCall () {
    return fs.existsSync
  }
}

module.exports = DoesFileExistSync
