'use strict'

const { Backend, RestApi } = require('@cuties/rest')
const { Value } = require('@cuties/json')
const { Created } = require('@cuties/created')
const RedirectEndpoint = require('./endpoints/RedirectEndpoint')
const env = process.env.NODE_ENV || 'local'

module.exports = class {
  constructor (config) {
    return new Backend(
      'http',
      new Value(config, `${env}.http.port`),
      new Value(config, `${env}.host`),
      new RestApi(
        new Created(
          RedirectEndpoint,
          new Value(config, `${env}.http.port`),
          new Value(config, `${env}.port`)
        )
      )
    )
  }
}
