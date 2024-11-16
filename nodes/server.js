const http2 = require('http2')
const fs = require('fs')
const domain = require('domain')
const tls = require('tls')
const cluster = require('cluster')

const handleRequests = require('./handleRequests')
const constructDomain = require('./constructDomain')
const readSecrets = require('./readSecrets')

const proxyServer = require('./proxyServer')

const http1xhandler = require('./http1xhandler')

module.exports = function server(app) {
  const certAndKeyExists = fs.existsSync(global.config.cert) &&
    fs.existsSync(global.config.key)
  const keyFile = certAndKeyExists ? global.config.key : global.config.tmpKey
  const certFile = certAndKeyExists ? global.config.cert : global.config.tmpCert
  
  global.config.host = global.config.host || 'localhost'
  global.config.port = global.config.port || 8004

  const server = http2.createSecureServer({
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
    SNICallback: (servername, callback) => {
      const certAndKeyExists = fs.existsSync(global.config.cert) &&
        fs.existsSync(global.config.key)
      const keyFile = certAndKeyExists ? global.config.key : global.config.tmpKey
      const certFile = certAndKeyExists ? global.config.cert : global.config.tmpCert
      const ctx = tls.createSecureContext({
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
      })
      callback(null, ctx)
    },
    allowHTTP1: true
  }, http1xhandler)

  server.on('stream', (stream, headers) => {
    constructDomain(server, stream).run(async () => {
      app.config = global.config
      await handleRequests(app, stream, headers)
    })
  })

  process.on('exit', () => {
    if (server.listening) {
      global.log(`server on worker ${process.pid} is about to be closed`)
      server.close()
    }
  })

  process.on('message', (message) => {
    if (message === 'Message from Primary Process: Exit your process with code 0 to restart it again.') {
      process.exit(0)
    }
  })
  
  return function serverListener() {
    server.listen({
      host: global.config.host,
      port: global.config.port
    }, () => {
      global.log(`HTTP/2 server running at https://${global.config.host}:${global.config.port}`)
    })
    if (process.env.ENV) {
      const itIsProd = process.env.ENV.startsWith('prod')
      if (itIsProd && !global.config.proxy.port) {
        throw new Error('In prod environment you must specifiy a port for HTTP proxy server in cofing with key: `proxy: { port: <value> }`')
      }
      if (itIsProd) {
        proxyServer({
          proxyPort: global.config.proxy.port,
          host: global.config.host,
          port: global.config.port,
          webroot: global.config.webroot
        })()
      }
    }
  }
}
