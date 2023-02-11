'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is worker
class ForkedWorker extends AsyncObject {
  constructor (cluster, env) {
    super(cluster, env)
  }

  syncCall () {
    return (cluster, env) => {
      return cluster.fork(env)
    }
  }
}

module.exports = ForkedWorker
