'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class TagPagesByPosts extends AsyncObject {
  constructor (posts, postPartInLink, dirToSave, version) {
    super(posts, postPartInLink, dirToSave, version)
  }

  syncCall () {
    return (posts, postPartInLink, dirToSave, version) => {
      const tagPages = {}
      const postCount = {}
      Object.keys(posts).forEach((postPath) => {
        const postContent = posts[postPath]
        const $ = cheerio.load(postContent)
        const title = $('h1').first().text()
        const postLink = `/../${postPartInLink}/${path.basename(postPath, '.html')}?v=${version}`
        $('a.tag').each((index, elm) => {
          const tagName = $(elm).text()
          const key = path.join(dirToSave, `${this.strWithReplacedRusCharsWithLatinChars(tagName.replace(/ /g, '').toLowerCase())}.html`)
          tagPages[key] = tagPages[key] || `<div class="posts-by-tag">0 posts about ${tagName}</div>`
          postCount[key] = postCount[key] || 0
          tagPages[key] += `<div class="post-link"><a href="${postLink}">${title}</a></div>`
          postCount[key] += 1
        })
      })
      Object.keys(tagPages).forEach((path) => {
        tagPages[path] = tagPages[path].replace('0 posts about', `${postCount[path]} ${postCount[path] === 1 ? 'post' : 'posts'} about`)
      })
      return tagPages
    }
  }

  // based on https://gist.github.com/diolavr/d2d50686cb5a472f5696
  strWithReplacedRusCharsWithLatinChars (str) {
    const ru = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya' }
    const latinStr = []
    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i')
    for (let i = 0; i < str.length; ++i) {
      latinStr.push(ru[str[i].toLowerCase()] || str[i])
    }
    return latinStr.join('')
  }
}

module.exports = TagPagesByPosts
