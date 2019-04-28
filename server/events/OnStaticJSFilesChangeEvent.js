'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { SpawnedCommand } = require('@cuties/spawn')

class OnStaticJSFilesChangeEvent extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      return (eventType, fileName) => {
        if (eventType === 'change') {
          new SpawnedCommand('grunt').call()
        }
      }
    }
  }
}

module.exports = OnStaticJSFilesChangeEvent
