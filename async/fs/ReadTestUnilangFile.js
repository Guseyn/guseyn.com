'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

class ReadTestUnilangFile extends AsyncObject {
  constructor (testName, fontName) {
    super(testName, fontName)
  }

  asyncCall () {
    return (testName, fontName, callback) => {
      fs.readFile(`${__root}/web-app/unilang/visual-tests/${fontName}/${testName}.txt`, { encoding: 'utf8' }, callback)
    }
  }
}

module.exports = ReadTestUnilangFile
