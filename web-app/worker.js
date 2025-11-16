import fs from 'fs'
import path  from 'path'

import server from '#nodes/server.js'
import app from '#nodes/app.js'
import endpoint from '#nodes/endpoint.js'
import src from '#nodes/src.js'
import body from '#nodes/body.js'

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
