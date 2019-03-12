'use strict'

const { AsyncObject } = require('@cuties/cutie')

class CreatedLogsPage extends AsyncObject {
  constructor (files) {
    super(files)
  }

  syncCall () {
    return (files) => {
      let page = '<h2>Logs:</h2>'
      files.forEach(file => {
        page += `&nbsp;&nbsp;<a href="/../logs/${file}">logs/${file}</a><br/>`
      })
      return page
    }
  }
}

module.exports = CreatedLogsPage
