'use strict'

const cluster = require('cluster')
// eslint-disable-next-line node/no-deprecated-api
const domain = require('domain')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { Nothing } = require(`${__root}/async/async/index`)
const { Value } = require(`${__root}/async/json/index`)
const { SafeReadDataByPath } = require(`${__root}/async/fs/index`)
const { Worker, WorkerWithExitEvent, ExitSubprocessOnMessageFromPrimaryProcessEvent } = require(`${__root}/async/cluster/index`)
const { ProcessWithSignalEvent, ProcessWithExitEvent, ProcessWithMessageEvent } = require(`${__root}/async/process/index`)
const { CreatedMap } = require(`${__root}/async/map/index`)
const { LoggedToOutput } = require(`${__root}/async/log/index`)
const { Sleep } = require(`${__root}/async/process/index`)
const { InParallel } = require(`${__root}/async/async/index`)
const { CreatedServer, ListeningServer, MessageForConnectedServer, MessageForConnectedProxyServer } = require(`${__root}/async/http/index`)
const { InternalServerErrorEvent } = require(`${__root}/async/rest/index`)
const { ClearResouresOnSubprocessExitEventInLocalEnv, ClearResouresOnSubprocessExitEventInProdEnv } = require(`${__root}/async/cluster/index`)
const { SNICallback } = require(`${__root}/async/tls/index`)

const ENV = process.env.NODE_ENV || 'local'
const SETUP_MODE = process.env.SETUP_MODE || null
const REST_API = require('./RestApi')
const PROXY_REST_API = require('./ProxyRestApi')
const LETS_WAIT_A_BIT_FOR_SOME_RESOURCES_TO_START_ITS_NEEDED_MOSTLY_FOR_LOCAL_ENVIRONMENT = new Sleep(3500)

const CLEAR_RESOURCES_ON_SUBPROCESS_EXIT_EVENT = {
  'local': new ClearResouresOnSubprocessExitEventInLocalEnv(
    as('SERVER')
  ),
  'prod': new ClearResouresOnSubprocessExitEventInProdEnv(
    as('SERVER'),
    as('PROXY_SERVER')
  )
}

const PROXY_SERVER = {
  'local': new Nothing(),
  'prod': new ListeningServer(
    new CreatedServer(
      new Value(
        as('ENV_CONFIG'),
        'proxy.protocol'
      ),
      domain,
      cluster,
      new InternalServerErrorEvent(),
      PROXY_REST_API
    ).as('PROXY_SERVER'),
    new CreatedMap(
      'port', new Value(
        as('ENV_CONFIG'),
        'proxy.port'
      ),
      'host', new Value(
        as('ENV_CONFIG'),
        'proxy.host'
      )
    )
  )
}

const SERVER_OPTIONS = {
  'setup-mode': {},
  'local': {},
  'prod': new CreatedMap(
    'SNICallback', new SNICallback(
      new Value(
        as('ENV_CONFIG'),
        'key'
      ),
      new Value(
        as('ENV_CONFIG'),
        'cert'
      ),
      new Value(
        as('ENV_CONFIG'),
        'ca'
      )
    ),
    'key', new SafeReadDataByPath(
      new Value(
        as('ENV_CONFIG'),
        'key'
      ),
      { encoding: 'utf-8' }
    ),
    'cert', new SafeReadDataByPath(
      new Value(
        as('ENV_CONFIG'),
        'cert'
      ),
      { encoding: 'utf-8' }
    ),
    'ca', new SafeReadDataByPath(
      new Value(
        as('ENV_CONFIG'),
        'ca'
      ),
      { encoding: 'utf-8' }
    )
  )
}

const SERVER = new ListeningServer(
  new CreatedServer(
    as('PROTOCOL'),
    domain,
    cluster,
    new InternalServerErrorEvent(),
    REST_API,
    SERVER_OPTIONS[SETUP_MODE ? 'setup-mode' : ENV]
  ).as('SERVER'),
  new CreatedMap(
    'port', as('PORT'),
    'host', as('HOST')
  )
)

module.exports = LETS_WAIT_A_BIT_FOR_SOME_RESOURCES_TO_START_ITS_NEEDED_MOSTLY_FOR_LOCAL_ENVIRONMENT.after(
  PROXY_SERVER[ENV].after(
    new LoggedToOutput(
      new MessageForConnectedProxyServer(
        as('ENV_CONFIG'),
        process.pid
      )
    ).after(
      SERVER.after(
        new LoggedToOutput(
          new MessageForConnectedServer(
            as('PROTOCOL'),
            as('HOST'),
            as('PORT'),
            process.pid
          )
        ).after(
          new InParallel(
            new WorkerWithExitEvent(
              new Worker(
                cluster
              ),
              CLEAR_RESOURCES_ON_SUBPROCESS_EXIT_EVENT[ENV]
            ),
            new ProcessWithSignalEvent(
              process,
              'SIGINT',
              CLEAR_RESOURCES_ON_SUBPROCESS_EXIT_EVENT[ENV]
            ),
            new ProcessWithExitEvent(
              process,
              CLEAR_RESOURCES_ON_SUBPROCESS_EXIT_EVENT[ENV]
            ),
            new ProcessWithMessageEvent(
              process,
              new ExitSubprocessOnMessageFromPrimaryProcessEvent(
                process
              )
            )
          )
        )
      )
    )
  )
)
