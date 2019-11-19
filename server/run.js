'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { If } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { Value } = require('@cuties/json')
const { ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const Config = require('./../async/Config')
const PrintedStage = require('./../async/PrintedStage')
const KilledProcessOnPortIfExists = require('./async/KilledProcessOnPortIfExists')
const ReloadedBackendOnFailedWorkerEvent = require('./events/ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./events/LoggedAndThrownErrorEvent')
const LaunchedBackend = require('./async/LaunchedBackend')
const TunedWatchers = require('./async/TunedWatchers')

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
          new PrintedStage(as('config'), as('packageJSON'), `RUN (${env})`).after(
            new If(
              devEnv,
              new TunedWatchers(
                as('config')
              )
            ).after(
              new If(
                new Value(as('config'), `${env}.clusterMode`),
                new ClusterWithForkedWorkers(
                  new ClusterWithExitEvent(
                    cluster,
                    new ReloadedBackendOnFailedWorkerEvent(cluster)
                  ), numCPUs
                ),
                new LaunchedBackend(as('config'))
              )
            )
          )
        ),
        new LaunchedBackend(as('config'))
      )
    )
  )
).call()
