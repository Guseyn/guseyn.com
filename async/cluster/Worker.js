'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is worker
class Worker extends AsyncObject {
  constructor (cluster) {
    super(cluster)
  }

  syncCall () {
    return (cluster) => {
      return cluster.worker
    }
  }
}

module.exports = Worker
