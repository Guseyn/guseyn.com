'use strict'

const cluster = require('cluster')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { InParallel } = require(`${__root}/async/async/index`)
const { ProcessWithSignalEvent, ProcessWithExitEvent, ProcessWithUncaughtException } = require(`${__root}/async/process/index`)
const { ClearResouresOnMainProcessExitEventForLocalEnv, GracefullyRestartGuseynEvent, ClearResouresOnMainProcessUncaughtExceptionEvent } = require(`${__root}/async/cluster/index`)

const PRIMARY_PROCESS_PID_FILE_PATH = './web-app/primary-process-pid.txt'

const CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_LOCAL_ENV = new ClearResouresOnMainProcessExitEventForLocalEnv(
  PRIMARY_PROCESS_PID_FILE_PATH
)

const CLEAR_RESOURCES_ON_MAIN_PROCESS_UNCAUGHT_EXCEPTION_EVENT_FOR_LOCAL_ENV = new ClearResouresOnMainProcessUncaughtExceptionEvent(
  PRIMARY_PROCESS_PID_FILE_PATH
)

module.exports = new InParallel(
  new ProcessWithUncaughtException(
    process,
    CLEAR_RESOURCES_ON_MAIN_PROCESS_UNCAUGHT_EXCEPTION_EVENT_FOR_LOCAL_ENV
  ),
  new ProcessWithSignalEvent(
    process,
    'SIGINT',
    CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_LOCAL_ENV
  ),
  new ProcessWithExitEvent(
    process,
    CLEAR_RESOURCES_ON_MAIN_PROCESS_EXIT_EVENT_FOR_LOCAL_ENV
  ),
  new ProcessWithSignalEvent(
    process,
    'SIGUSR1',
    new GracefullyRestartGuseynEvent(
      cluster
    )
  )
)
