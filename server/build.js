'use strict'

const { as } = require('@cuties/cutie')
const { Value } = require('@cuties/json')
const { ExecutedScripts } = require('@cuties/scripts')
const { ExecutedLint, ExecutedTestCoverage, ExecutedTestCoverageCheck } = require('@cuties/wall')
const Config = require('./../async/Config')
const PrintedLogoToConsole = require('./async/PrintedLogoToConsole')
const ExecutedGruntBuild = require('./async/ExecutedGruntBuild')

const env = process.env.NODE_ENV || 'local'

new Config('./config.json').as('config').after(
  new Config('./package.json').as('packageJSON').after(
    new PrintedLogoToConsole(`BUILD (${env})`).after(
      new ExecutedLint(process, './server', './static/js/es6', './test', './pages').after(
        new ExecutedTestCoverageCheck(
          new ExecutedTestCoverage(process, './test-executor.js'),
          { 'lines': 100, 'functions': 100, 'branches': 100 }
        ).after(
          new ExecutedGruntBuild(process).after(
            new ExecutedScripts(
              'node', 'js', new Value(as('config'), 'staticGenerators')
            )
          )
        )
      )
    )
  )
).call()
