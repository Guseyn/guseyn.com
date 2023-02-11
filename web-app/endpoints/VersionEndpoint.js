'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`

const { Endpoint, ResponseSentWithOkResult } = require(`${__root}/async/rest/index`)
const { CreatedMap } = require(`${__root}/async/map/index`)
const { ParsedJSON, Value } = require(`${__root}/async/json/index`)
const { ReadDataByPath } = require(`${__root}/async/fs/index`)

class VersionEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'GET')
  }

  body (request, response) {
    return new ResponseSentWithOkResult(
      response,
      new CreatedMap(
        'version',
        new Value(
          new ParsedJSON(
            new ReadDataByPath(
              `${__root}/package.json`,
              { encoding: 'utf-8' }
            )
          ),
          'version'
        )
      )
    )
  }
}

module.exports = VersionEndpoint
