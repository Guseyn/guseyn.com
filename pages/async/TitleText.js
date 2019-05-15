'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class TitleText extends AsyncObject {
  constructor (filePath, content) {
    super(filePath, content)
  }

  syncCall () {
    return (filePath, content) => {
      let title
      let titleMap = {
        'Post': new RegExp(/^static\/html\/posts/),
        'Posts': new RegExp(/^static\/html\/previews/),
        'Tag': new RegExp(/^static\/html\/tags/),
        'About': new RegExp(/^static\/html\/stuff\/about.html/),
        'Papers': new RegExp(/^static\/html\/stuff\/papers.html/),
        'Slides': new RegExp(/^static\/html\/stuff\/slides.html/),
        'Talks': new RegExp(/^static\/html\/stuff\/talks.html/),
        'Projects': new RegExp(/^static\/html\/stuff\/projects.html/),
        'Covers': new RegExp(/^static\/html\/stuff\/covers.html/)
      }
      for (let type in titleMap) {
        const pathRegExp = titleMap[type]
        if (pathRegExp.test(filePath)) {
          if (type === 'Post') {
            const $ = cheerio.load(content)
            title = $('h1').first().text()
          } else if (type === 'Tag') {
            title = `Tag: ${path.basename(filePath, '.html')}`
          } else {
            title = type
          }
          break
        }
      }
      return title
    }
  }
}

module.exports = TitleText
