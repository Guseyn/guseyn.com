'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const path = require('path')

class ResolvedFilesByDirectory extends AsyncObject {
  constructor (dir, files) {
    super(dir, files)
  }

  syncCall () {
    return (dir, files) => {
      return files.map(file => path.resolve(dir, file))
    }
  }
}

module.exports = ResolvedFilesByDirectory
