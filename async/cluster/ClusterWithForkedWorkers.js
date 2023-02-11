'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is cluster
class ClusterWithForkedWorkers extends AsyncObject {
  constructor (cluster, num, env) {
    super(cluster, num, env)
  }

  syncCall () {
    return (cluster, num, env) => {
      for (let i = 0; i < num; i++) {
        cluster.fork(env)
      }
      return cluster
    }
  }
}

module.exports = ClusterWithForkedWorkers
