'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is stats
class StatsByPath extends AsyncObject {
  constructor (path) {
    super(path)
  }

  asyncCall () {
    return fs.stat
  }
}

module.exports = StatsByPath
