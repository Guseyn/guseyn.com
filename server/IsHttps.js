'use strict'

const { AsyncObject } = require('@cuties/cutie')

class IsHttps extends AsyncObject {
  constructor (protocol) {
    super(protocol)
  }

  syncCall () {
    return (protocol) => {
      return protocol === 'https'
    }
  }
}

module.exports = IsHttps
