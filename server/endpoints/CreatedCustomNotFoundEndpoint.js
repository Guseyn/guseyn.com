'use strict'

const { AsyncObject } = require('@cuties/cutie')
const CustomNotFoundEndpoint = require('./CustomNotFoundEndpoint')

class CreatedCustomNotFoundEndpoint extends AsyncObject {
  constructor (regexpUrl, page) {
    super(regexpUrl, page)
  }

  syncCall () {
    return (regexpUrl, page) => {
      return new CustomNotFoundEndpoint(regexpUrl, page)
    }
  }
}

module.exports = CreatedCustomNotFoundEndpoint
