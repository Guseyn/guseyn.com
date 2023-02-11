'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`

const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require(`${__root}/async/http/index`)
const { ConcatenatedStrings } = require(`${__root}/async/string/index`)
const { ReadDataByPath } = require(`${__root}/async/fs/index`)
const { Endpoint } = require(`${__root}/async/rest/index`)

class AcmeChallengeEchoEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'GET')
  }

  body (request, response) {
    const url = request.url
    const parts = url.split('?')[0].split('/').filter(part => part !== '')
    const challengeUrlPart = parts[parts.length - 1]
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'ok.'
          ),
          'Content-Type', 'text/plain'
        ),
        new ConcatenatedStrings(
          challengeUrlPart,
          '.',
          new ReadDataByPath(
            `${__root}/lets-encrypt-token`
          )
        )
      )
    )
  }
}

module.exports = AcmeChallengeEchoEndpoint
