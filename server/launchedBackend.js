'use strict'

const { as } = require('@cuties/cutie')
const { If, Else } = require('@cuties/if-else')
const { Backend } = require('@cuties/rest')
const { ReadDataByPath } = require('@cuties/fs')
const { Value } = require('@cuties/json')
const IsHttps = require('./async/IsHttps')
const api = require('./api')
const CreatedOptionsByProtocol = require('./async/CreatedOptionsByProtocol')
const env = process.env.NODE_ENV || 'local'

module.exports = new If(
  new IsHttps(
    new Value(as('config'), `${env}.protocol`)
  ),
  new Backend(
    'https',
    new Value(as('config'), `${env}.port`),
    new Value(as('config'), `${env}.host`),
    api,
    new CreatedOptionsByProtocol(
      new Value(as('config'), `${env}.protocol`),
      new ReadDataByPath(
        new Value(as('config'), 'key')
      ),
      new ReadDataByPath(
        new Value(as('config'), 'cert')
      )
    )
  ),
  new Else(
    new Backend(
      'http',
      new Value(as('config'), `${env}.port`),
      new Value(as('config'), `${env}.host`),
      api
    )
  )
)
