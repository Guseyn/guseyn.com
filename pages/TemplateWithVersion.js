'use strict'

const { AsyncObject } = require('@cuties/cutie')

class TemplateWithVersion extends AsyncObject {
  constructor (template, version) {
    super(template, version)
  }

  syncCall () {
    return (template, version) => {
      return template.replace(/\{version\}/g, version)
    }
  }
}

module.exports = TemplateWithVersion
