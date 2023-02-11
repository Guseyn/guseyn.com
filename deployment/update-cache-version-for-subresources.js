'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject, as } = require(`${__root}/async/core/index`)
const { ReadDataByPath, ReadDataFromFiles, ReadFilesOfDirectoryRecursively, FilesWithUpdatedData } = require(`${__root}/async/fs/index`)
const { ParsedJSON, Value } = require(`${__root}/async/json/index`)
const { LoggedToOutput } = require(`${__root}/async/log/index`)

const DIRECTORY_WITH_HTML_FILES_WHERE_WE_NEED_TO_UPDATE_CACHE_VERSION_IN_URLS_OF_SUBRESOURCES = 'web-app/html'
const READ_WRITE_FILES_OPTIONS = { encoding: 'utf-8' }
const VERSION_REGEXP = /v=(\d+\.)?(\d+\.)?(\*|\d+)/g

class UpdateVersionFunction extends AsyncObject {
  constructor (version) {
    super(version)
  }

  syncCall () {
    return (version) => {
      return (data) => {
        return data.replace(VERSION_REGEXP, `v=${version}`)
      }
    }
  }
}

new Value(
  new ParsedJSON(
    new ReadDataByPath(
      'package.json',
      READ_WRITE_FILES_OPTIONS
    )
  ),
  'version'
).as('VERSION').after(
  new UpdateVersionFunction(
    as('VERSION')
  ).as('UPDATE_VERSION_FUNCTION').after(
    new FilesWithUpdatedData(
      new ReadDataFromFiles(
        new ReadFilesOfDirectoryRecursively(
          DIRECTORY_WITH_HTML_FILES_WHERE_WE_NEED_TO_UPDATE_CACHE_VERSION_IN_URLS_OF_SUBRESOURCES
        ),
        READ_WRITE_FILES_OPTIONS
      ),
      as('UPDATE_VERSION_FUNCTION')
    ).after(
      new LoggedToOutput(
        'cache version is updated for all subresources'
      )
    )
  )
).call()
