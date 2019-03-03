'use strict'

const { AsyncObject } = require('@cuties/cutie')
const path = require('path')

class UrlToFSPathMapper extends AsyncObject {
  constructor (staticDirectory) {
    super(staticDirectory || '')
  }

  syncCall () {
    return (staticDirectory) => {
      return (url) => {
        let fileLocation
        if (staticDirectory) {
          fileLocation = path.join(staticDirectory, ...url.split('/').filter(path => path !== ''))
        } else {
          fileLocation = path.join(...url.split('/').filter(path => path !== ''))
        }
        return fileLocation
      }
    }
  }
}

module.exports = UrlToFSPathMapper
