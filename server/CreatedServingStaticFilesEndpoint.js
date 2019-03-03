'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { ServingFilesEndpoint, CachedServingFilesEndpoint } = require('@cuties/rest')

class CreatedServingStaticFilesEndpoint extends AsyncObject {
  constructor (regexpUrl, mapper, notFounEndpoint, toCache) {
    super(regexpUrl, mapper, notFounEndpoint, toCache)
  }

  syncCall () {
    return (regexpUrl, mapper, notFounEndpoint, toCache) => {
      let endpoint
      if (toCache) {
        endpoint = new CachedServingFilesEndpoint(regexpUrl, mapper, notFounEndpoint)
      } else {
        endpoint = new ServingFilesEndpoint(regexpUrl, mapper, notFounEndpoint)
      }
      return endpoint
    }
  }
}

module.exports = CreatedServingStaticFilesEndpoint
