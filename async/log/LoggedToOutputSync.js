'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

const OUTPUT_LOG_FILE = `${__root}/logs/output.log`

class LoggedToOutputSync extends AsyncObject {
  constructor (log) {
    super(log)
  }

  syncCall () {
    return (log) => {
      const ENV = process.env.NODE_ENV || 'local'
      if (ENV === 'local') {
        console.log(log)
      } else {
        fs.writeFileSync(OUTPUT_LOG_FILE, `${log}\n`, { 'flag': 'a' })
      }
      return log
    }
  }
}

module.exports = LoggedToOutputSync
