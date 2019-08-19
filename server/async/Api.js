'use strict'

const { RestApi, ServingFilesEndpoint, CachedServingFilesEndpoint } = require('@cuties/rest')
const { Value } = require('@cuties/json')
const { Created } = require('@cuties/created')
const CustomIndexEndpoint = require('./../endpoints/CustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./../endpoints/CustomNotFoundEndpoint')
const LogsEndpoint = require('./../endpoints/LogsEndpoint')
const CustomInternalServerErrorEndpoint = require('./../endpoints/CustomInternalServerErrorEndpoint')
const UrlToFSPathMapper = require('./UrlToFSPathMapper')
const CuteUrlToFSPathForHtmlMapper = require('./CuteUrlToFSPathForHtmlMapper')
const env = process.env.NODE_ENV || 'local'
const headers = env === 'prod' ? { 'Cache-Control': 'cache, public, max-age=86400' } : {}
const servingFilesEndpoint = env === 'prod' ? CachedServingFilesEndpoint : ServingFilesEndpoint

class CreatedCustomNotFoundEndpoint {
  constructor (config) {
    return new Created(
      CustomNotFoundEndpoint,
      new RegExp(/^\/not-found/),
      new Value(config, 'notFoundPage')
    )
  }
}

module.exports = class {
  constructor (config) {
    return new RestApi(
      new Created(
        CustomIndexEndpoint,
        new Value(config, 'index'),
        new CreatedCustomNotFoundEndpoint(config)
      ),
      new Created(
        servingFilesEndpoint,
        new RegExp(/^\/(html|css|md|image|js|txt|yml|pdf)/),
        new UrlToFSPathMapper(
          new Value(config, 'static')
        ),
        headers,
        new CreatedCustomNotFoundEndpoint(config)
      ),
      new Created(
        servingFilesEndpoint,
        new RegExp(/^\/(posts|rus-posts|previews|rus-previews|stuff|tags|rus-tags)/),
        new CuteUrlToFSPathForHtmlMapper(
          new Value(config, 'staticHtml')
        ),
        headers,
        new CreatedCustomNotFoundEndpoint(config)
      ),
      new Created(
        LogsEndpoint,
        new RegExp(/^\/logs\/all(\/|)$/),
        new Value(config, 'logs')
      ),
      new ServingFilesEndpoint(
        new RegExp(/^\/logs/),
        new UrlToFSPathMapper(),
        {},
        new CreatedCustomNotFoundEndpoint(config)
      ),
      new ServingFilesEndpoint(
        new RegExp(/^\/package.json(\/|)$/),
        new UrlToFSPathMapper(),
        {},
        new CreatedCustomNotFoundEndpoint(config)
      ),
      new CreatedCustomNotFoundEndpoint(config),
      new CustomInternalServerErrorEndpoint()
    )
  }
}
