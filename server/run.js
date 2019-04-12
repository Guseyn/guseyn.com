'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { If, Else } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { ParsedJSON, Value } = require('@cuties/json')
const { Backend, RestApi, ServingFilesEndpoint, CachedServingFilesEndpoint } = require('@cuties/rest')
const { ReadDataByPath, WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const { FoundProcessOnPort, KilledProcess, Pid, ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const { Created } = require('@cuties/created')
const CustomIndexEndpoint = require('./endpoints/CustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./endpoints/CustomNotFoundEndpoint')
const LogsEndpoint = require('./endpoints/LogsEndpoint')
const CustomInternalServerErrorEndpoint = require('./endpoints/CustomInternalServerErrorEndpoint')
const OnPageStaticJsFilesChangeEvent = require('./events/OnPageStaticJsFilesChangeEvent')
const OnStaticGeneratorsChangeEvent = require('./events/OnStaticGeneratorsChangeEvent')
const OnTemplatesChangeEvent = require('./events/OnTemplatesChangeEvent')
const ReloadedBackendOnFailedWorkerEvent = require('./events/ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./events/LoggedAndThrownErrorEvent')
const UrlToFSPathMapper = require('./async/UrlToFSPathMapper')
const CuteUrlToFSPathForHtmlMapper = require('./async/CuteUrlToFSPathForHtmlMapper')
const PrintedToConsolePageLogo = require('./async/PrintedToConsolePageLogo')
const CreatedOptionsByProtocol = require('./async/CreatedOptionsByProtocol')
const IsHttps = require('./async/IsHttps')

const numCPUs = require('os').cpus().length
const env = process.env.NODE_ENV || 'local'
const devEnv = env === 'local' || env === 'dev'

const customNotFoundEndpoint = new Created(
  CustomNotFoundEndpoint,
  new RegExp(/^\/not-found/),
  new Value(
    as('config'),
    'notFoundPage'
  )
)

const restApi = new RestApi(
  new Created(
    CustomIndexEndpoint,
    new Value(as('config'), 'index'),
    customNotFoundEndpoint
  ),
  new Created(
    env === 'prod' ? CachedServingFilesEndpoint : ServingFilesEndpoint,
    new RegExp(/^\/(html|css|md|image|js|txt|yml|pdf)/),
    new UrlToFSPathMapper(
      new Value(as('config'), 'static')
    ),
    env === 'prod' ? { 'Cache-Control': 'cache, public, max-age=86400' } : {},
    customNotFoundEndpoint
  ),
  new Created(
    env === 'prod' ? CachedServingFilesEndpoint : ServingFilesEndpoint,
    new RegExp(/^\/(posts|previews|stuff|tags)/),
    new CuteUrlToFSPathForHtmlMapper(
      new Value(as('config'), 'staticHtml')
    ),
    env === 'prod' ? { 'Cache-Control': 'cache, public, max-age=86400' } : {},
    customNotFoundEndpoint
  ),
  new Created(
    LogsEndpoint,
    new RegExp(/^\/logs\/all(\/|)$/),
    new Value(
      as('config'),
      'logs'
    )
  ),
  new Created(
    ServingFilesEndpoint,
    new RegExp(/^\/logs/),
    new UrlToFSPathMapper(),
    {},
    customNotFoundEndpoint,
    false
  ),
  new Created(
    ServingFilesEndpoint,
    new RegExp(/^\/package.json(\/|)$/),
    new UrlToFSPathMapper(),
    {},
    customNotFoundEndpoint,
    false
  ),
  customNotFoundEndpoint,
  new CustomInternalServerErrorEndpoint()
)

const launchedHttpBackend = new Backend(
  'http',
  new Value(as('config'), `${env}.port`),
  new Value(as('config'), `${env}.host`),
  restApi
)

const launchedHttpsBackend = new Backend(
  'https',
  new Value(as('config'), `${env}.port`),
  new Value(as('config'), `${env}.host`),
  restApi,
  new CreatedOptionsByProtocol(
    new Value(as('config'), `${env}.protocol`),
    new ReadDataByPath(
      new Value(as('config'), 'key')
    ),
    new ReadDataByPath(
      new Value(as('config'), 'cert')
    )
  )
)

const watchers = new WatcherWithEventTypeAndFilenameListener(
  new Value(as('config'), 'staticGenerators'),
  { persistent: true, recursive: true, encoding: 'utf8' },
  new OnStaticGeneratorsChangeEvent(
    new Value(as('config'), 'staticGenerators')
  )
).after(
  new WatcherWithEventTypeAndFilenameListener(
    new Value(as('config'), 'templates'),
    { persistent: true, recursive: true, encoding: 'utf8' },
    new OnTemplatesChangeEvent(
      new Value(as('config'), 'staticGenerators')
    )
  ).after(
    new WatcherWithEventTypeAndFilenameListener(
      new Value(as('config'), 'mdFiles'),
      { persistent: true, recursive: true, encoding: 'utf8' },
      new OnTemplatesChangeEvent(
        new Value(as('config'), 'staticGenerators')
      )
    ).after(
      new WatcherWithEventTypeAndFilenameListener(
        new Value(as('config'), 'staticJs'),
        { persistent: true, recursive: true, encoding: 'utf8' },
        new OnPageStaticJsFilesChangeEvent(
          new Value(as('config'), 'staticJs'),
          new Value(as('config'), 'bundleJs')
        )
      )
    )
  )
)

new ParsedJSON(
  new ReadDataByPath('./config.json')
).as('config').after(
  new ParsedJSON(
    new ReadDataByPath('./package.json')
  ).as('packageJSON').after(
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
              new Value(as('config'), `${env}.port`)
            )
          )
        ).after(
          new PrintedToConsolePageLogo(
            new ReadDataByPath(
              new Value(as('config'), 'page.logoText')
            ),
            new Value(as('packageJSON'), 'version'),
            `RUN (${env})`
          ).after(
            new If(
              devEnv,
              watchers
            ).after(
              new If(
                new Value(as('config'), `${env}.clusterMode`),
                new ClusterWithForkedWorkers(
                  new ClusterWithExitEvent(
                    cluster,
                    new ReloadedBackendOnFailedWorkerEvent(cluster)
                  ), numCPUs
                ),
                new If(
                  new IsHttps(
                    new Value(as('config'), `${env}.protocol`)
                  ),
                  launchedHttpsBackend,
                  new Else(
                    launchedHttpBackend
                  )
                )
              )
            )
          )
        ),
        new If(
          new IsHttps(
            new Value(as('config'), `${env}.protocol`)
          ),
          launchedHttpsBackend,
          new Else(
            launchedHttpBackend
          )
        )
      )
    )
  )
).call()
