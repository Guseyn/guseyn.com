'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { SignalSentToProcess } = require(`${__root}/async/process/index`)
const { ReadDataByPath } = require(`${__root}/async/fs/index`)
const { Logged } = require(`${__root}/async/log/index`)
const { ConcatenatedStrings } = require(`${__root}/async/string/index`)

const PRIMARY_PROCESS_PID_FILE_PATH = './web-app/primary-process-pid.txt'

module.exports = new SignalSentToProcess(
  new ReadDataByPath(
    PRIMARY_PROCESS_PID_FILE_PATH,
    { 'encoding': 'utf8' }
  ).as('PRIMARY_PROCESS_PID'),
  'SIGUSR1'
).after(
  new Logged(
    new ConcatenatedStrings(
      'We just sent SIGUSR1 to primary process with pid:',
      as('PRIMARY_PROCESS_PID'),
      '.\n',
      'Then primary process will send message to its subprocesses to exit with code 0.\n',
      'It will restart them (gracefully and with timeout one by one).\n',
      'That will allow to reach zero downtime while we restarting the application with new codebase.'
    )
  )
)
