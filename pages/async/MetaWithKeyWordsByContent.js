'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')

class MetaWithKeyWordsByContent extends AsyncObject {
  constructor (basicWords, content) {
    super(basicWords, content)
  }

  syncCall () {
    return (basicWords, content) => {
      const $ = cheerio.load(content)
      let titles = []
      let tags = []
      $('h1').each((index, elm) => {
        titles = titles.concat(
          $(elm).text()
            .replace(/\s+/g, ' ')
            .split(' ')
        )
      })
      $('a.tag').each((index, elm) => {
        tags.push($(elm).text()
          .replace(/\s+/g, ' ')
        )
      })
      const keywords = titles.concat(tags).map(w => w.toLowerCase())
      const uniqueKeywords = keywords.filter((w, i) => keywords.indexOf(w) === i)
      return `name="keywords" content="${basicWords}, ${uniqueKeywords.join(', ')}"`
    }
  }
}

module.exports = MetaWithKeyWordsByContent
