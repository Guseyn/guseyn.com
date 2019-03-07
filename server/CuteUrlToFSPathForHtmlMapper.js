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
        // without version of file
        url = `${url.replace(/\?v=([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$/, '')}.html`
        return path.join(staticHtmlDirectory, ...url.split('/').filter(path => path !== ''))
      }
    }
  }
}

module.exports = CuteUrlToFSPathForHtmlMapper
