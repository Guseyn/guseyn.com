'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { If } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { Value } = require('@cuties/json')
const { ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const Config = require('./../async/Config')
const KilledProcessOnPortIfExists = require('./async/KilledProcessOnPortIfExists')
const ReloadedBackendOnFailedWorkerEvent = require('./events/ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./events/LoggedAndThrownErrorEvent')
const PrintedLogoToConsole = require('./async/PrintedLogoToConsole')
const launchedBackend = require('./launchedBackend')
const tunedWatchers = require('./tunedWatchers')

const numCPUs = require('os').cpus().length
const env = process.env.NODE_ENV || 'local'
const devEnv = env === 'local' || env === 'dev'

new Config('./config.json').as('config').after(
  new Config('./package.json').as('packageJSON').after(
    new ProcessWithUncaughtExceptionEvent(
      process, new LoggedAndThrownErrorEvent(
        new Value(as('config'), 'logs')
      )
    ).after(
      new If(
        new IsMaster(cluster),
        new KilledProcessOnPortIfExists(
          new Value(as('config'), `${env}.port`)
        ).after(
          new PrintedLogoToConsole(`RUN (${env})`).after(
            new If(devEnv, tunedWatchers).after(
              new If(
                new Value(as('config'), `${env}.clusterMode`),
                new ClusterWithForkedWorkers(
                  new ClusterWithExitEvent(
                    cluster,
                    new ReloadedBackendOnFailedWorkerEvent(cluster)
                  ), numCPUs
                ),
                launchedBackend
              )
            )
          )
        ),
        launchedBackend
      )
    )
  )
).call()
