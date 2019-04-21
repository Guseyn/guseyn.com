'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { Value } = require('@cuties/json')
const { If, Else } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const Config = require('./../async/Config')
const KilledProcessOnPortIfExists = require('./async/KilledProcessOnPortIfExists')
const ReloadedBackendOnFailedWorkerEvent = require('./events/ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./events/LoggedAndThrownErrorEvent')
const redirectedBackend = require('./redirectedBackend')

const env = process.env.NODE_ENV || 'local'

new Config('./config.json').as('config').after(
  new ProcessWithUncaughtExceptionEvent(
    process, new LoggedAndThrownErrorEvent(
      new Value(as('config'), 'logs')
    )
  ).after(
    new If(
      new IsMaster(cluster),
      new KilledProcessOnPortIfExists(
        new Value(as('config'), `${env}.http.port`)
      ).after(
        new ClusterWithForkedWorkers(
          new ClusterWithExitEvent(
            cluster,
            new ReloadedBackendOnFailedWorkerEvent(cluster)
          ), 1
        )
      ),
      new Else(
        redirectedBackend
      )
    )
  )
).call()
