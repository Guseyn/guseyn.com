'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { Backend, RestApi } = require('@cuties/rest')
const { ParsedJSON, Value } = require('@cuties/json')
const { ReadDataByPath } = require('@cuties/fs')
const { If, Else } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { FoundProcessOnPort, KilledProcess, Pid, ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const CreatedRedirectEndpoint = require('./endpoints/CreatedRedirectEndpoint')
const ReloadedBackendOnFailedWorkerEvent = require('./events/ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./events/LoggedAndThrownErrorEvent')

const env = process.env.NODE_ENV || 'local'

const redirectBackendForProd = new Backend(
  'http',
  new Value(as('config'), `${env}.http.port`),
  new Value(as('config'), `${env}.host`),
  new RestApi(
    new CreatedRedirectEndpoint(
      new Value(as('config'), `${env}.http.port`),
      new Value(as('config'), `${env}.port`)
    )
  )
)

new ParsedJSON(
  new ReadDataByPath('./config.json')
).as('config').after(
  new ProcessWithUncaughtExceptionEvent(
    process, new LoggedAndThrownErrorEvent(
      new Value(as('config'), 'logs')
    )
  ).after(
    new If(
      new IsMaster(cluster),
      new KilledProcess(
        new Pid(
          new FoundProcessOnPort(
            new Value(as('config'), `${env}.http.port`)
          )
        )
      ).after(
        new ClusterWithForkedWorkers(
          new ClusterWithExitEvent(
            cluster,
            new ReloadedBackendOnFailedWorkerEvent(cluster)
          ), 1
        )
      ),
      new Else(
        redirectBackendForProd
      )
    )
  )
).call()
