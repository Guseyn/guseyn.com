'use strict'

const { AsyncObject } = require('@cuties/cutie')
const path = require('path')

class CuteUrlToFSPathForHtmlMapper extends AsyncObject {
  constructor (staticHtmlDirectory) {
    super(staticHtmlDirectory || '')
  }

  syncCall () {
    return (staticHtmlDirectory) => {
      return (url) => {
        url += '.html'
        return path.join(staticHtmlDirectory, ...url.split('/').filter(path => path !== ''))
      }
    }
  }
}

module.exports = CuteUrlToFSPathForHtmlMapper
