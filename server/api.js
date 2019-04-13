'use strict'

const { as } = require('@cuties/cutie')
const { RestApi, ServingFilesEndpoint, CachedServingFilesEndpoint } = require('@cuties/rest')
const { Value } = require('@cuties/json')
const { Created } = require('@cuties/created')
const CustomIndexEndpoint = require('./endpoints/CustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./endpoints/CustomNotFoundEndpoint')
const LogsEndpoint = require('./endpoints/LogsEndpoint')
const CustomInternalServerErrorEndpoint = require('./endpoints/CustomInternalServerErrorEndpoint')
const UrlToFSPathMapper = require('./async/UrlToFSPathMapper')
const CuteUrlToFSPathForHtmlMapper = require('./async/CuteUrlToFSPathForHtmlMapper')
const env = process.env.NODE_ENV || 'local'

const customNotFoundEndpoint = new Created(
  CustomNotFoundEndpoint,
  new RegExp(/^\/not-found/),
  new Value(as('config'), 'notFoundPage')
)

module.exports = new RestApi(
  new Created(
    CustomIndexEndpoint,
    new Value(as('config'), 'index'),
    customNotFoundEndpoint
  ),
  new Created(
    env === 'prod' ? CachedServingFilesEndpoint : ServingFilesEndpoint,
    new RegExp(/^\/(html|css|md|image|js|txt|yml|pdf)/),
    new UrlToFSPathMapper(
      new Value(as('config'), 'static')
    ),
    env === 'prod' ? { 'Cache-Control': 'cache, public, max-age=86400' } : {},
    customNotFoundEndpoint
  ),
  new Created(
    env === 'prod' ? CachedServingFilesEndpoint : ServingFilesEndpoint,
    new RegExp(/^\/(posts|previews|stuff|tags)/),
    new CuteUrlToFSPathForHtmlMapper(
      new Value(as('config'), 'staticHtml')
    ),
    env === 'prod' ? { 'Cache-Control': 'cache, public, max-age=86400' } : {},
    customNotFoundEndpoint
  ),
  new Created(
    LogsEndpoint,
    new RegExp(/^\/logs\/all(\/|)$/),
    new Value(as('config'), 'logs')
  ),
  new ServingFilesEndpoint(
    new RegExp(/^\/logs/),
    new UrlToFSPathMapper(),
    {},
    customNotFoundEndpoint
  ),
  new ServingFilesEndpoint(
    new RegExp(/^\/package.json(\/|)$/),
    new UrlToFSPathMapper(),
    {},
    customNotFoundEndpoint
  ),
  customNotFoundEndpoint,
  new CustomInternalServerErrorEndpoint()
)
