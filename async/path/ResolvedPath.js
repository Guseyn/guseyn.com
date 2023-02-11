'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const path = require('path')

// Represented result is string
class ResolvedPath extends AsyncObject {
  constructor (...paths) {
    super(...paths)
  }

  syncCall () {
    return path.resolve
  }
}

module.exports = ResolvedPath
