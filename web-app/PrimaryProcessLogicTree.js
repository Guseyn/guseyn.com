'use strict'

const cluster = require('cluster')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { KilledProcessOnPortIfExists } = require(`${__root}/async/process/index`)
const { WrittenFile } = require(`${__root}/async/fs/index`)
const { LoggedToOutput } = require(`${__root}/async/log/index`)
const { CreatedCluster } = require(`${__root}/async/cluster/index`)
const { ConcatenatedStrings } = require(`${__root}/async/string/index`)
const { PrintedLogo } = require(`${__root}/async/logo/index`)
const { InParallel } = require(`${__root}/async/async/index`)

const ENV = process.env.NODE_ENV || 'local'
const LOCAL_ENV_LOGIC_TREE = require('./PrimaryProcessLogicTreeInLocalEnv')
const PROD_ENV_LOGIC_TREE = require('./PrimaryProcessLogicTreeInProdEnv')

const numberOfCPUCores = require('os').cpus().length

const LOGIC_TREES_BY_ENV = {
  'local': LOCAL_ENV_LOGIC_TREE,
  'prod': PROD_ENV_LOGIC_TREE
}

const NUMBER_OF_FORKS_BY_ENV = {
  'local': 2,
  'prod': numberOfCPUCores
}

const PROCESS_ON_PORTS_TO_KILL_BY_ENV = {
  'local': new InParallel(
    new KilledProcessOnPortIfExists(
      as('PORT')
    )
  ),
  'prod': new InParallel(
    new KilledProcessOnPortIfExists(
      as('PORT')
    )
  )
}

const PRIMARY_PROCESS_PID_FILE_PATH = './web-app/primary-process-pid.txt'

module.exports = new PrintedLogo().after(
  PROCESS_ON_PORTS_TO_KILL_BY_ENV[ENV].after(
    new LoggedToOutput(
      new ConcatenatedStrings(
        'Primary process id: ',
        process.pid,
        ', we are going to write this process.pid to temporary file web-app/primary-process-pid.txt'
      )
    ).after(
      new WrittenFile(
        PRIMARY_PROCESS_PID_FILE_PATH,
        `${process.pid}`
      ).after(
        new CreatedCluster(cluster, NUMBER_OF_FORKS_BY_ENV[ENV]).after(
          LOGIC_TREES_BY_ENV[ENV]
        )
      )
    )
  )
)
