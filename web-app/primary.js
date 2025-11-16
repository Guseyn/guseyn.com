import fs from 'fs'

const txtLogo = fs.readFileSync('./web-app/logo.txt', 'utf-8')
const version = JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version
const environment = process.env.ENV

import path from 'path'

global.log(`\x1b[33m${txtLogo}\n\nversion: ${version}, environment: ${environment}\x1b[0m`)

import prepareStaticFilesWithCdnAndCacheVersions from './prepareStaticFilesWithCdnAndCacheVersions.js'

prepareStaticFilesWithCdnAndCacheVersions()
