'use strict'

const { AsyncObject } = require('@cuties/cutie')
const showdown = require('showdown')
const path = require('path')

class HtmlFilesFromMdFiles extends AsyncObject {
  constructor (mdFiles, htmlDir) {
    super(mdFiles, htmlDir)
  }

  syncCall () {
    return (mdFiles, htmlDir) => {
      const htmlFiles = {}
      const converter = new showdown.Converter()
      Object.keys(mdFiles).forEach((mdPath, index) => {
        const mdContent = mdFiles[mdPath]
        const htmlContent = converter.makeHtml(mdContent)
        htmlFiles[path.join(htmlDir, `${path.basename(mdPath, '.md')}.html`)] = htmlContent
      })
      return htmlFiles
    }
  }
}

module.exports = HtmlFilesFromMdFiles
