'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const readDataFromFiles = require('./custom-calls/readDataFromFiles')

// Represented result is object: {fileName1: data1, fileName2: data2, ... }
class ReadDataFromFiles extends AsyncObject {
  constructor (files, options) {
    super(files, options || {
      encoding: null,
      flag: 'r'
    })
  }

  asyncCall () {
    return readDataFromFiles
  }
}

module.exports = ReadDataFromFiles
