'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { AppendedFile } = require('@cuties/fs')
const { ThrownError } = require('@cuties/error')
const { JoinedPaths } = require('@cuties/path')
const { EmitterWithoutAnyListeners } = require('@cuties/event')

class LoggedAndThrownErrorEvent extends AsyncObject {
  constructor (logDir) {
    super(logDir)
  }

  syncCall () {
    return (logDir) => {
      return (error) => {
        const date = new Date()
        new AppendedFile(
          new JoinedPaths(
            logDir,
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
          ),
          `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()} => ${error.message}\n${error.stack}\n`
        ).after(
          new EmitterWithoutAnyListeners(
            process,
            'uncaughtException'
          ).after(
            new ThrownError(error)
          )
        ).call()
      }
    }
  }
}

module.exports = LoggedAndThrownErrorEvent
