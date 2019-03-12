'use strict'

const { AsyncObject } = require('@cuties/cutie')
const LogsEndpoint = require('./LogsEndpoint')

class CreatedLogsEndpoint extends AsyncObject {
  constructor (regexpUrl, logsDir) {
    super(regexpUrl, logsDir)
  }

  syncCall () {
    return (regexpUrl, logsDir) => {
      return new LogsEndpoint(regexpUrl, logsDir)
    }
  }
}

module.exports = CreatedLogsEndpoint
