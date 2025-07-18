const fs = require('fs')
const path = require('path')

const server = require('./../nodes/server')
const app = require('./../nodes/app')
const endpoint = require('./../nodes/endpoint')
const src = require('./../nodes/src')
const body = require('./../nodes/body')

const baseFolder = path.join('web-app', 'static')

const environment = process.env.ENV || 'local'

const useCors = (environment === 'prod')
const useCache = (environment === 'prod')
const corsOptions = (environment === 'prod') ? {
  allowedOrigins: [ 'guseyn.com', 'cdn.guseyn.com' ],
  allowedMethods: [ 'GET', 'OPTIONS' ],
  maxAge: 86400
} : {
  allowedOrigins: [ '0.0.0.0:8001' ],
  allowedMethods: [ 'GET', 'OPTIONS' ],
  maxAge: 86400
}

const cacheControl = (environment === 'prod') ? {
  cacheControl: 'cache, public, max-age=432000'
} : {
  cacheControl: 'no-cache'
}

server(
  app({
    indexFile: './web-app/static/html/all-posts.html', 
    api: [],
    static: [
      src(/^\/((html\/main-page-template\.html)|(html\/frammento-main-page-template\.html)|css|js|json|svg|image|md|pdf|font|ttf|yml|magenta-soundfonts)/, {
        baseFolder,
        useGzip: true,
        useCors,
        ...corsOptions,
        useCache,
        ...cacheControl
      }),
      src(/^\/html/, {
        baseFolder,
        useGzip: true
      })
    ],
    deps: { }
  })
)()
