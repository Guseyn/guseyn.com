'use strict'

const path = require('path')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { RestApi, ServingCompressedFilesEndpoint, CORSEndpoint } = require(`${__root}/async/rest/index`)
const VersionEndpoint = require('./endpoints/VersionEndpoint')
const AcmeChallengeEchoEndpoint = require('./endpoints/AcmeChallengeEchoEndpoint')
const CustomIndexEndpoint = require('./endpoints/CustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./endpoints/CustomNotFoundEndpoint')
const MethodNotAllowedEndpoint = require('./endpoints/MethodNotAllowedEndpoint')
const CustomInternalServerErrorEndpoint = require('./endpoints/CustomInternalServerErrorEndpoint')

const InternalServerErrorEndpoint = require('./endpoints/InternalServerErrorEndpoint')

const urlToFsMapper = (url) => {
  const parts = url.split('?')[0].split('/').filter(part => part !== '')
  return path.join('web-app', ...parts)
}

const urlToFsMapperForLogs = (url) => {
  const parts = url.split('?')[0].split('/').filter(part => part !== '')
  return path.join(...parts)
}

const ENV = process.env.NODE_ENV || 'local'
const HEADERS_FOR_MAIN_RESOURCES = {
  'Cache-Control': 'no-cache'
}
const HEADERS_FOR_SUBRESOURCES = (ENV === 'prod') ? {
  'Cache-Control': 'cache, public, max-age=432000'
} : {
  'Cache-Control': 'no-cache'
}
const INDEX_PAGE_PATH = './web-app/html/all-posts.html'
const NOT_FOUND_PAGE_PATH = './web-app/html/404.html'

const NOT_FOUND_ENDPOINT = new CustomNotFoundEndpoint(new RegExp(/\/not-found/), NOT_FOUND_PAGE_PATH)
const METHOD_NOT_ALLOWED_ENDPOINT = new MethodNotAllowedEndpoint(new RegExp(/\/method-not-allowed/))
const INTERNAL_SERVER_ERROR_ENDPOINT = new CustomInternalServerErrorEndpoint()

const CORS_OPTIONS = (ENV === 'prod') ? {
  allowedOrigins: [ 'unisonofficial.com', 'unisonofficial.b-cdn.net' ],
  allowedMethods: [ 'GET', 'OPTIONS' ],
  maxAge: 86400
} : {
  allowedOrigins: [ '192.168.1.92:8000', '127.0.0.1:8000' ],
  allowedMethods: [ 'GET', 'OPTIONS' ],
  maxAge: 86400
}

module.exports = new RestApi(
  new CustomIndexEndpoint(INDEX_PAGE_PATH, NOT_FOUND_ENDPOINT),
  new VersionEndpoint(new RegExp(/^\/(version)/)),
  new AcmeChallengeEchoEndpoint(new RegExp(/^\/\.well-known\/acme-challenge/)),
  new CORSEndpoint(new RegExp(/^\/((html\/main-page-template\.html)|css|js|json|svg|image|md|pdf|ttf|yml)/), CORS_OPTIONS),
  new ServingCompressedFilesEndpoint(new RegExp(/^\/((html\/main-page-template\.html)|css|js|json|svg|image|md|pdf|ttf|yml)/), urlToFsMapper, HEADERS_FOR_SUBRESOURCES, NOT_FOUND_ENDPOINT, CORS_OPTIONS.allowedOrigins),
  new ServingCompressedFilesEndpoint(new RegExp(/^\/(html)/), urlToFsMapper, HEADERS_FOR_MAIN_RESOURCES, NOT_FOUND_ENDPOINT),
  new ServingCompressedFilesEndpoint(new RegExp(/^\/logs/), urlToFsMapperForLogs, HEADERS_FOR_MAIN_RESOURCES, NOT_FOUND_ENDPOINT),
  new InternalServerErrorEndpoint(/^\/(internal-server-error)/),
  METHOD_NOT_ALLOWED_ENDPOINT,
  INTERNAL_SERVER_ERROR_ENDPOINT
)
