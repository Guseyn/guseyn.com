const fs = require('fs')

const cluster = require('./../nodes/cluster')

process.env.ENV = process.env.ENV || 'local'

const config = JSON.parse(
  fs.readFileSync(
    `./web-app/env/${process.env.ENV}.json`
  )
)
let logFile
if (process.env.ENV === 'prod') {
  logFile = './output.log'
}

cluster('web-app/primary.js', 'web-app/worker.js')({
  config,
  logFile
})
