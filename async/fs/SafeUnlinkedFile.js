'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { LoggedToOutputSync } = require(`${__root}/async/log/index`)
const fs = require('fs')

// Represented result is file (as path)
class SafeUnlinkedFile extends AsyncObject {
  constructor (path) {
    super(path)
  }

  asyncCall () {
    return (path, callback) => {
      this.file = path
      fs.unlink(path, callback)
    }
  }

  onErrorAndResult (error, result) {
    if (error) {
      new LoggedToOutputSync(`${this.file} no longer can be deleted`).call()
    } else {
      new LoggedToOutputSync(`${this.file} is deleted`).call()
    }
    return this.file
  }

  continueAfterFail () {
    return true
  }
}

module.exports = SafeUnlinkedFile
