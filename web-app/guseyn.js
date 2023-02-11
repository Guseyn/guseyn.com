'use strict'

const logTimestamp = require('log-timestamp')

logTimestamp(() => {
  return `[${new Date().toUTCString()}]`
})

const cluster = require('cluster')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { EnvConfig } = require(`${__root}/async/env/index`)
const { Value } = require(`${__root}/async/json/index`)
const { ValueOrElse } = require(`${__root}/async/object/index`)
const { IsMaster } = require(`${__root}/async/cluster/index`)
const { WrittenFile, SafeUnlinkedFile } = require(`${__root}/async/fs/index`)
const { IfElse } = require(`${__root}/async/logic/index`)
const { InParallel } = require(`${__root}/async/async/index`)

const ENV = process.env.NODE_ENV || 'local'

const OUTPUT_LOG_FILE = `${__root}/logs/output.log`
const EMPTY_STRING = ''

const THIS_IS_WHAT_WE_DO_IN_PRIMARY_PROCESS = require('./PrimaryProcessLogicTree')
const THIS_IS_WHAT_WE_DO_IN_SUBPROCESS_SUPPORTED_BY_CLUSTER_API_IN_NODE = require('./SubprocessLogicTree')

const WHOLE_APPLICATION = new EnvConfig(ENV).as('ENV_CONFIG').after(
  new InParallel(
    new Value(
      as('ENV_CONFIG'),
      'protocol'
    ).as('PROTOCOL'),
    new Value(
      as('ENV_CONFIG'),
      'host'
    ).as('HOST'),
    new ValueOrElse(
      as('ENV_CONFIG'),
      'domain',
      null
    ).as('DOMAIN'),
    new Value(
      as('ENV_CONFIG'),
      'port'
    ).as('PORT')
  ).after(
    new IfElse(
      new IsMaster(cluster),
      THIS_IS_WHAT_WE_DO_IN_PRIMARY_PROCESS,
      THIS_IS_WHAT_WE_DO_IN_SUBPROCESS_SUPPORTED_BY_CLUSTER_API_IN_NODE
    )
  )
)

module.exports = new IfElse(
  new IsMaster(cluster),
  new SafeUnlinkedFile(
    OUTPUT_LOG_FILE
  ).after(
    new WrittenFile(
      OUTPUT_LOG_FILE,
      EMPTY_STRING
    ).after(
      WHOLE_APPLICATION
    )
  ),
  WHOLE_APPLICATION
)
