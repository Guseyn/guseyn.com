'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { If, Else } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { ParsedJSON, Value } = require('@cuties/json')
const { Backend, RestApi } = require('@cuties/rest')
const { ReadDataByPath, WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const { FoundProcessOnPort, KilledProcess, Pid, ProcessWithUncaughtExceptionEvent } = require('@cuties/process')
const CreatedCustomIndexEndpoint = require('./../CreatedCustomIndexEndpoint')
const CreatedCustomNotFoundEndpoint = require('./../CreatedCustomNotFoundEndpoint')
const CreatedServingStaticFilesEndpoint = require('./../CreatedServingStaticFilesEndpoint')
const CustomInternalServerErrorEndpoint = require('./../CustomInternalServerErrorEndpoint')
const OnPageStaticJsFilesChangeEvent = require('./../OnPageStaticJsFilesChangeEvent')
const OnStaticGeneratorsChangeEvent = require('./../OnStaticGeneratorsChangeEvent')
const OnTemplatesChangeEvent = require('./../OnTemplatesChangeEvent')
const ReloadedBackendOnFailedWorkerEvent = require('./../ReloadedBackendOnFailedWorkerEvent')
const LoggedAndThrownErrorEvent = require('./../LoggedAndThrownErrorEvent')
const UrlToFSPathMapper = require('./../UrlToFSPathMapper')
const CuteUrlToFSPathForHtmlMapper = require('./../CuteUrlToFSPathForHtmlMapper')
const PrintedToConsolePageLogo = require('./../PrintedToConsolePageLogo')
const CreatedOptionsByProtocol = require('./../CreatedOptionsByProtocol')
const IsHttps = require('./../IsHttps')

const numCPUs = require('os').cpus().length
const env = process.env.NODE_ENV || 'local'
const devEnv = env === 'local' || env === 'dev'

const customNotFoundEndpoint = new CreatedCustomNotFoundEndpoint(
  new RegExp(/^\/not-found/),
  new Value(
    as('config'),
    'notFoundPage'
  )
)

const restApi = new RestApi(
  new CreatedCustomIndexEndpoint(
    new Value(as('config'), 'index'),
    customNotFoundEndpoint
  ),
  new CreatedServingStaticFilesEndpoint(
    new RegExp(/^\/(css|html|md|image|js|txt|yml|pdf)/),
    new UrlToFSPathMapper(
      new Value(as('config'), 'static')
    ),
    customNotFoundEndpoint,
    env === 'prod'
  ),
  new CreatedServingStaticFilesEndpoint(
    new RegExp(/^\/(posts|previews|stuff|tags)/),
    new CuteUrlToFSPathForHtmlMapper(
      new Value(as('config'), 'staticHtml')
    ),
    customNotFoundEndpoint,
    env === 'prod'
  ),
  new CreatedServingStaticFilesEndpoint(
    new RegExp(/^\/(logs)/),
    new UrlToFSPathMapper(),
    customNotFoundEndpoint,
    false
  ),
  new CreatedServingStaticFilesEndpoint(
    new RegExp(/^\/package.json(\/|)$/),
    new UrlToFSPathMapper(),
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

new ParsedJSON(
  new ReadDataByPath('./config.json')
).as('config').after(
  new ParsedJSON(
    new ReadDataByPath('./package.json')
  ).as('packageJson').after(
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
            new Value(as('packageJson'), 'version'),
            `RUN (${env})`
          ).after(
            new If(
              devEnv,
              new WatcherWithEventTypeAndFilenameListener(
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
