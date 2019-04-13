'use strict'

const { as } = require('@cuties/cutie')
const { Backend, RestApi } = require('@cuties/rest')
const { Value } = require('@cuties/json')
const { Created } = require('@cuties/created')
const RedirectEndpoint = require('./endpoints/RedirectEndpoint')
const env = process.env.NODE_ENV || 'local'

module.exports = new Backend(
  'http',
  new Value(as('config'), `${env}.http.port`),
  new Value(as('config'), `${env}.host`),
  new RestApi(
    new Created(
      RedirectEndpoint,
      new Value(as('config'), `${env}.http.port`),
      new Value(as('config'), `${env}.port`)
    )
  )
)
