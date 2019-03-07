'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { ServingFilesEndpoint, CachedServingFilesEndpoint } = require('@cuties/rest')

class CreatedServingStaticFilesEndpoint extends AsyncObject {
  constructor (regexpUrl, mapper, headers, notFounEndpoint, toCache) {
    super(regexpUrl, mapper, headers, notFounEndpoint, toCache)
  }

  syncCall () {
    return (regexpUrl, mapper, headers, notFounEndpoint, toCache) => {
      let endpoint
      if (toCache) {
        endpoint = new CachedServingFilesEndpoint(regexpUrl, mapper, headers, notFounEndpoint)
      } else {
        endpoint = new ServingFilesEndpoint(regexpUrl, mapper, headers, notFounEndpoint)
      }
      return endpoint
    }
  }
}

module.exports = CreatedServingStaticFilesEndpoint
