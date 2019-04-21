'use strict'

const { AsyncObject } = require('@cuties/cutie')
const path = require('path')

class JoinedPathMapper extends AsyncObject {
  constructor (dir) {
    super(dir)
  }

  syncCall () {
    return (dir) => {
      return (filename) => {
        return path.join(dir, filename)
      }
    }
  }
}

module.exports = JoinedPathMapper
