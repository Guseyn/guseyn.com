'use strict'

const cluster = require('cluster')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { ProcessWithSignalEvent, ProcessWithExitEvent, ProcessWithUncaughtException } = require(`${__root}/async/process/index`)
const { ClearResouresOnMainProcessExitEventForProdEnv, ClearResouresOnMainProcessUncaughtExceptionEvent, GracefullyRestartGuseynEvent } = require(`${__root}/async/cluster/index`)
const { InParallel } = require(`${__root}/async/async/index`)

const PRIMARY_PROCESS_PID_FILE_PATH = './web-app/primary-process-pid.txt'

const CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_PROD_ENV = new ClearResouresOnMainProcessExitEventForProdEnv(
  PRIMARY_PROCESS_PID_FILE_PATH
)

const CLEAR_RESOURCES_ON_MAIN_PROCESS_UNCAUGHT_EXCEPTION_EVENT_FOR_PROD_ENV = new ClearResouresOnMainProcessUncaughtExceptionEvent()

module.exports = new InParallel(
  new ProcessWithSignalEvent(
    process,
    'SIGINT',
    CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_PROD_ENV
  ),
  new ProcessWithExitEvent(
    process,
    CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_PROD_ENV
  ),
  new ProcessWithUncaughtException(
    process,
    CLEAR_RESOURCES_ON_MAIN_PROCESS_UNCAUGHT_EXCEPTION_EVENT_FOR_PROD_ENV
  ),
  new ProcessWithSignalEvent(
    process,
    'SIGUSR1',
    new GracefullyRestartGuseynEvent(
      cluster
    )
  )
)
