'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`

const { as } = require(`${__root}/async/core/index`)
const { RestApi } = require(`${__root}/async/rest/index`)
const { Created } = require(`${__root}/async/created/index`)
const { Value } = require(`${__root}/async/json/index`)

const ProxyEndpoint = require('./endpoints/ProxyEndpoint')
const AcmeChallengeEchoEndpoint = require('./endpoints/AcmeChallengeEchoEndpoint')

module.exports = new RestApi(
  new AcmeChallengeEchoEndpoint(
    new RegExp(/^\/\.well-known\/acme-challenge/)
  ),
  new Created(
    ProxyEndpoint,
    new Value(
      as('ENV_CONFIG'),
      'proxy.port'
    ),
    new Value(
      as('ENV_CONFIG'),
      'port'
    )
  )
)
