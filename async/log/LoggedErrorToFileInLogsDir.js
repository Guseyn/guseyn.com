'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

const logFileName = () => {
  const date = new Date()
  let month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month
  let day = date.getDate()
  day = (day < 10 ? '0' : '') + day
  const filename = `${date.getFullYear()}-${month}-${day}.log`
  return filename
}

class LoggedErrorToFileInLogsDir extends AsyncObject {
  constructor (error) {
    super(error)
  }

  asyncCall () {
    return (error, callback) => {
      fs.writeFile(`${__root}/logs/${logFileName()}`, `${error}\n`, { 'flag': 'a' }, callback)
    }
  }
}

module.exports = LoggedErrorToFileInLogsDir
