'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const updateDataInFiles = require('./custom-calls/updateDataInFiles')

class FilesWithUpdatedData extends AsyncObject {
  constructor (files, updateFunction, options) {
    super(files, updateFunction, options || {
      encoding: 'utf8',
      mode: 0o666,
      flag: 'w'
    })
  }

  asyncCall () {
    return updateDataInFiles
  }
}

module.exports = FilesWithUpdatedData
