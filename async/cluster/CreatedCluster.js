'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

const ClusterWithForkedWorkers = require('./ClusterWithForkedWorkers')
const ClusterWithExitEvent = require('./ClusterWithExitEvent')
const ReloadEventForExitedWorker = require('./ReloadEventForExitedWorker')

const numberOfCPUCores = require('os').cpus().length

class CreatedCluster extends AsyncObject {
  constructor (cluster, numberOfForks = numberOfCPUCores) {
    return new ClusterWithForkedWorkers(
      new ClusterWithExitEvent(
        cluster,
        new ReloadEventForExitedWorker(cluster)
      ), numberOfForks
    )
  }
}

module.exports = CreatedCluster
