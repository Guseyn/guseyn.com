'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { LoggedErrorToFileInLogsDir } = require(`${__root}/async/log/index`)
const { InParallel } = require(`${__root}/async/async/index`)
const ResponseSentWithInternalServerError = require('./../ResponseSentWithInternalServerError')

class InternalServerErrorEvent extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      return (error, request, response) => {
        new InParallel(
          new LoggedErrorToFileInLogsDir(error.stack),
          new ResponseSentWithInternalServerError(response, error.stack)
        ).call()
      }
    }
  }
}

module.exports = InternalServerErrorEvent
