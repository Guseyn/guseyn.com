'use strict'

const http = require('http')
const https = require('https')

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

const supportedProtocols = {
  http,
  https
}

const TIME_TO_EXIT_PROCESS = 30000

class CreatedServer extends AsyncObject {
  constructor (protocol, domain, cluster, errorEvent, requestListener, options = {}) {
    super(protocol, domain, cluster, errorEvent, requestListener, options)
  }

  syncCall () {
    return (protocol, domain, cluster, errorEvent, requestListener, options) => {
      if (Object.keys(supportedProtocols).indexOf(protocol) !== -1) {
        const server = supportedProtocols[protocol].createServer(options, (request, response) => {
          const d = domain.create()
          d.on('error', (err) => {
            try {
              errorEvent(err, request, response)
              const killtimer = setTimeout(() => {
                process.exit(1)
              }, TIME_TO_EXIT_PROCESS)
              killtimer.unref()
              server.close()
              if (cluster.worker.process.connected) {
                cluster.worker.disconnect()
              }
            } catch (err2) {
              throw err2
            }
          })
          d.add(request)
          d.add(response)
          d.run(() => {
            requestListener(request, response)
          })
        })
        return server
      } else {
        throw new Error(`Protocol ${protocol} is not supported.`)
      }
    }
  }
}

module.exports = CreatedServer
