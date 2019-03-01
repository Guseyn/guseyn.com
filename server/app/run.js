'use strict'

const cluster = require('cluster')
const { as } = require('@cuties/cutie')
const { If, Else } = require('@cuties/if-else')
const { IsMaster, ClusterWithForkedWorkers, ClusterWithExitEvent } = require('@cuties/cluster')
const { ParsedJSON, Value } = require('@cuties/json')
const { Backend, RestApi, CreatedCachedServingFilesEndpoint, CreatedServingFilesEndpoint } = require('@cuties/rest')
const { ReadDataByPath, WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const { FoundProcessOnPort, KilledProcess, Pid } = require('@cuties/process')
const CreatedCustomIndexEndpoint = require('./../CreatedCustomIndexEndpoint')
const CreatedCustomNotFoundEndpoint = require('./../CreatedCustomNotFoundEndpoint')
const CustomInternalServerErrorEndpoint = require('./../CustomInternalServerErrorEndpoint')
const OnPageStaticJsFilesChangeEvent = require('./../OnPageStaticJsFilesChangeEvent')
const OnStaticGeneratorsChangeEvent = require('./../OnStaticGeneratorsChangeEvent')
const OnTemplatesChangeEvent = require('./../OnTemplatesChangeEvent')
const ReloadedBackendOnFailedWorkerEvent = require('./../ReloadedBackendOnFailedWorkerEvent')
const UrlToFSPathMapper = require('./../UrlToFSPathMapper')
const CuteUrlToFSPathForHtmlMapper = require('./../CuteUrlToFSPathForHtmlMapper')
const PrintedToConsolePageLogo = require('./../PrintedToConsolePageLogo')
const CreatedOptionsByProtocol = require('./../CreatedOptionsByProtocol')
const CreatedRedirectEndpoint = require('./../CreatedRedirectEndpoint')
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

const launchedBackend = new Backend(
  new Value(as('config'), `${env}.protocol`),
  new Value(as('config'), `${env}.port`),
  new Value(as('config'), `${env}.host`),
  new RestApi(
    new CreatedCustomIndexEndpoint(
      new Value(as('config'), 'index'),
      customNotFoundEndpoint
    ),
    new CreatedServingFilesEndpoint(
      new RegExp(/^\/(css|html|image|js|txt)/),
      new UrlToFSPathMapper(
        new Value(as('config'), 'static')
      ),
      customNotFoundEndpoint
    ),
    new CreatedCachedServingFilesEndpoint(
      new RegExp(/^\/(posts|previews|stuff|tags)/),
      new CuteUrlToFSPathForHtmlMapper(
        new Value(as('config'), 'staticHtml')
      ),
      customNotFoundEndpoint
    ),
    customNotFoundEndpoint,
    new CustomInternalServerErrorEndpoint()
  ),
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
  new ParsedJSON(
    new ReadDataByPath('./package.json')
  ).as('packageJson').after(
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
            new IsHttps(
              new Value(as('config'), `${env}.protocol`)
            ),
            new KilledProcess(
              new Pid(
                new FoundProcessOnPort(
                  new Value(as('config'), `${env}.http.port`)
                )
              )
            ).after(
              redirectBackendForProd
            )
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
                new Else(
                  launchedBackend
                )
              )
            )
          )
        )
      ),
      new Else(
        launchedBackend
      )
    )
  )
).call()
