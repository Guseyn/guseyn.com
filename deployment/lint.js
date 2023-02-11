'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { ExecutedLint } = require(`${__root}/async/lint/index`)

new ExecutedLint(
  process,
  './async',
  './deployment',
  './web-app/endpoints',
  './web-app/PrimaryProcessLogicTree.js',
  './web-app/PrimaryProcessLogicTreeInLocalEnv.js',
  './web-app/PrimaryProcessLogicTreeInProdEnv.js',
  './web-app/ProxyRestApi.js',
  './web-app/RestApi.js',
  './web-app/SubprocessLogicTree.js',
  './web-app/guseyn-restart.js',
  './web-app/guseyn.js',
  './web-app/js/day-night.js',
  './web-app/js/iframe.js',
  './web-app/js/script.js',
  './web-app/js/youtube.js'
).call()
