'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is file[]
class ReadFilesOfDirectories extends AsyncObject {
  constructor (...filesFromDirs) {
    super(...filesFromDirs)
  }

  syncCall () {
    return (...filesFromDirs) => {
      let files = [].concat(...filesFromDirs)
      return files
    }
  }
}

module.exports = ReadFilesOfDirectories
