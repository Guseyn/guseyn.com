'use strict'

const { AsyncObject } = require('@cuties/cutie')
const CustomIndexEndpoint = require('./CustomIndexEndpoint')

class CreatedCustomIndexEndpoint extends AsyncObject {
  constructor (indexUrl, version) {
    super(indexUrl, version)
  }

  syncCall () {
    return (indexUrl, version) => {
      return new CustomIndexEndpoint(indexUrl, version)
    }
  }
}

module.exports = CreatedCustomIndexEndpoint
