'use strict'

const { If, Else } = require('@cuties/if-else')
const { Backend } = require('@cuties/rest')
const { ReadDataByPath } = require('@cuties/fs')
const { Value } = require('@cuties/json')
const IsHttps = require('./IsHttps')
const Api = require('./Api')
const CreatedOptionsByProtocol = require('./CreatedOptionsByProtocol')
const env = process.env.NODE_ENV || 'local'

module.exports = class {
  constructor (config) {
    return new If(
      new IsHttps(
        new Value(config, `${env}.protocol`)
      ),
      new Backend(
        'https',
        new Value(config, `${env}.port`),
        new Value(config, `${env}.host`),
        new Api(config),
        new CreatedOptionsByProtocol(
          new Value(config, `${env}.protocol`),
          new ReadDataByPath(
            new Value(config, 'key')
          ),
          new ReadDataByPath(
            new Value(config, 'cert')
          )
        )
      ),
      new Else(
        new Backend(
          'http',
          new Value(config, `${env}.port`),
          new Value(config, `${env}.host`),
          new Api(config)
        )
      )
    )
  }
}
