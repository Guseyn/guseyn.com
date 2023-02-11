'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is buffer or string
class SafeReadDataByPath extends AsyncObject {
  constructor (path, options) {
    super(path, options || {
      encoding: null,
      flag: 'r'
    })
  }

  asyncCall () {
    return (path, options, callback) => {
      if (!path) {
        callback(new Error('path is not defined'))
      } else {
        fs.readFile(path, options, callback)
      }
    }
  }

  onErrorAndResult (error, result) {
    if (error) {
      return ''
    }
    return result
  }

  continueAfterFail () {
    return true
  }
}

module.exports = SafeReadDataByPath
