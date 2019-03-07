'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class TagsFromPosts extends AsyncObject {
  constructor (posts, dirToSave, version) {
    super(posts, dirToSave, version)
  }

  syncCall () {
    return (posts, dirToSave, version) => {
      const tags = {}
      const postCount = {}
      Object.keys(posts).forEach((postPath) => {
        const postContent = posts[postPath]
        const $ = cheerio.load(postContent)
        const title = $('h1').first().text()
        const postLink = `/../posts/${path.basename(postPath).split('.')[0]}?v=${version}`
        $('a.tag').each((index, elm) => {
          const tagName = $(elm).text()
          const key = path.join(dirToSave, `${tagName.replace(/ /g, '').toLowerCase()}.html`)
          tags[key] = tags[key] || `<div class="posts-by-tag">0 posts about ${tagName}</div>`
          postCount[key] = postCount[key] || 0
          tags[key] += `<div class="post-link"><a href="${postLink}">${title}</a></div>`
          postCount[key] += 1
        })
      })
      Object.keys(tags).forEach((path) => {
        tags[path] = tags[path].replace('0 posts about', `${postCount[path]} ${postCount[path] === 1 ? 'post' : 'posts'} about`)
      })
      return tags
    }
  }
}

module.exports = TagsFromPosts
