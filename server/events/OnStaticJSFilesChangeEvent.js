'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { SpawnedCommand } = require('@cuties/spawn')

class OnStaticJSFilesChangeEvent extends AsyncObject {
  constructor (staticJsFilesDirectory, pageBundleJsFile) {
    super(staticJsFilesDirectory, pageBundleJsFile)
  }

  syncCall () {
    return (staticJsFilesDirectory, pageBundleJsFile) => {
      return (eventType, fileName) => {
        if (eventType === 'change') {
          new SpawnedCommand('grunt').call()
        }
      }
    }
  }
}

module.exports = OnStaticJSFilesChangeEvent
