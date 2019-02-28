'use strict'

const { AsyncObject } = require('@cuties/cutie')

class CreatedOptionsByProtocol extends AsyncObject {
  constructor (protocol, key, cert) {
    super(protocol, key, cert)
  }

  syncCall () {
    return (protocol, key, cert) => {
      let options = {}
      if (protocol === 'https') {
        options = {
          key: key,
          cert: cert
        }
      }
      return options
    }
  }
}

module.exports = CreatedCustomIndexEndpoint
