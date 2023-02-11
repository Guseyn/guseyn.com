'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { Event } = require(`${__root}/async/core/index`)
const { LoggedToOutputSync } = require(`${__root}/async/log/index`)

const ForkedWorker = require('./ForkedWorker')

class ReloadEventForExitedWorker extends Event {
  constructor (cluster) {
    super()
    this.cluster = cluster
  }

  body (worker, code, signal) {
    new LoggedToOutputSync(`worker ${worker.process.pid} died (${signal || code}). restarting...`).call()
    new ForkedWorker(this.cluster).call()
  }
}

module.exports = ReloadEventForExitedWorker
