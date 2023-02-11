'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is file
class WrittenFile extends AsyncObject {
  constructor (file, data, options) {
    super(file, data, options || {
      encoding: 'utf8',
      mode: 0o666,
      flag: 'w'
    })
  }

  asyncCall () {
    return (file, data, options, callback) => {
      this.file = file
      fs.writeFile(file, data, options, callback)
    }
  }

  onResult () {
    return this.file
  }
}

module.exports = WrittenFile
