'use strict'

const { AsyncObject } = require('@cuties/cutie')

class TemplateWithVersion extends AsyncObject {
  constructor (template, version) {
    super(template, version)
  }

  syncCall () {
    return (template, version) => {
      return template.replace(/\?v=\{version\}/g, `?v=${version}`)
    }
  }
}

module.exports = TemplateWithVersion
