'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

const OUTPUT_LOG_FILE = `${__root}/logs/output.log`

class LoggedToOutput extends AsyncObject {
  constructor (log) {
    super(log)
  }

  asyncCall () {
    return (log, callback) => {
      const ENV = process.env.NODE_ENV || 'local'
      if (ENV === 'local') {
        console.log(log)
        callback(null, log)
      } else {
        fs.writeFile(OUTPUT_LOG_FILE, `${log}\n`, { 'flag': 'a' }, callback)
      }
    }
  }
}

module.exports = LoggedToOutput
