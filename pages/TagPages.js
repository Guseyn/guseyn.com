'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class TagPages extends AsyncObject {
  constructor (posts, dirToSave, version) {
    super(posts, dirToSave, version)
  }

  syncCall () {
    return (posts, dirToSave, version) => {
      const tagPages = {}
      const postCount = {}
      Object.keys(posts).forEach((postPath) => {
        const postContent = posts[postPath]
        const $ = cheerio.load(postContent)
        const title = $('h1').first().text()
        const postLink = `/../posts/${path.basename(postPath, '.html')}?v=${version}`
        $('a.tag').each((index, elm) => {
          const tagName = $(elm).text()
          const key = path.join(dirToSave, `${tagName.replace(/ /g, '').toLowerCase()}.html`)
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
}

module.exports = TagPages
