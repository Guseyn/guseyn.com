'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is cluster
class ClusterWithExitEvent extends AsyncObject {
  constructor (cluster, event) {
    super(cluster, event)
  }

  // event is an Event with body(worker, code, signal)
  syncCall () {
    return (cluster, event) => {
      cluster.on('exit', event)
      return cluster
    }
  }
}

module.exports = ClusterWithExitEvent
