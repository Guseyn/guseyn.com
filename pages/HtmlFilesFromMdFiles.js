'use strict'

const { AsyncObject } = require('@cuties/cutie')
const showdown = require('showdown')
const path = require('path')

class HtmlFilesFromMdFiles extends AsyncObject {
  constructor (mdFiles, htmlDir, fileNames) {
    super(mdFiles, htmlDir, fileNames)
  }

  syncCall () {
    return (mdFiles, htmlDir, fileNames) => {
      const htmlFiles = {}
      const converter = new showdown.Converter()
      Object.keys(mdFiles).forEach((mdPath, index) => {
        const mdContent = mdFiles[mdPath]
        const htmlContent = converter.makeHtml(mdContent)
        htmlFiles[path.join(htmlDir, `${fileNames[index].split('.')[0]}.html`)] = htmlContent
      })
      return htmlFiles
    }
  }
}

module.exports = HtmlFilesFromMdFiles
